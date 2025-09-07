'use client'

import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

// User profile interface
export interface UserProfile {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

// Create or update user profile
export async function upsertProfile(profile: Partial<UserProfile>) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error upserting profile:', error)
    return { data: null, error }
  }
}

// Get profile by user_id
export async function getProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return { data: null, error }
  }
}

// Upload user avatar
export async function uploadAvatar(file: File, userId: string) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return { data: publicUrl, error: null }
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return { data: null, error }
  }
}

// Delete previous avatar
export async function deleteAvatar(avatarUrl: string) {
  try {
    // Extract file path from URL
    const path = avatarUrl.split('/').pop()
    if (!path) return

    const { error } = await supabase.storage
      .from('avatars')
      .remove([`avatars/${path}`])

    if (error) throw error
  } catch (error) {
    console.error('Error deleting avatar:', error)
  }
}

// Custom hook to handle user profile
export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadProfile()
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return
    
    setLoading(true)
    const { data, error } = await getProfile(user.id)
    
    if (data) {
      setProfile(data)
    } else if (error && error.code === 'PGRST116') {
      // Profile does not exist, create a new one
      const newProfile = {
        user_id: user.id,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: null,
        phone: null,
        website: null
      }
      
      const { data: createdProfile } = await upsertProfile(newProfile)
      setProfile(createdProfile)
    }
    
    setLoading(false)
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return

    const { data, error } = await upsertProfile({
      ...profile,
      ...updates,
      user_id: user.id
    })

    if (data) {
      setProfile(data)
      return { success: true, error: null }
    }

    return { success: false, error }
  }

  return {
    profile,
    loading,
    updateProfile,
    loadProfile
  }
}