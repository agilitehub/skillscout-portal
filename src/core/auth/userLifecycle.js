// Global Instructions Rule Applied!
import { supabase } from './client'

/**
 * Ensure the user record exists in the users table.
 * Checks for existing record by email, uses it if found, creates new one otherwise.
 * @param {string} userId - The user's unique id (uuid)
 * @returns {Promise<boolean>} True if exists or created, false otherwise
 */
export const ensureUserRecord = async (userId) => {
  try {
    if (!supabase) throw new Error('Supabase client not initialized')
    if (!userId) throw new Error('User ID is required')

    const {
      data: { user: authUser }
    } = await supabase.auth.getUser()

    const userEmail = authUser.email

    const { data: existingUser, error: emailCheckError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .maybeSingle()

    if (emailCheckError && emailCheckError.code !== 'PGRST116') {
      console.error('Auth userLifecycle: Error checking for existing user by email:', emailCheckError)
    }

    if (existingUser) {
      let trashed = existingUser.trashed
      if (existingUser.id !== userId || trashed) {
        await supabase.from('users').delete().eq('id', existingUser.id)

        const { error: insertError } = await supabase.from('users').insert([
          {
            id: userId,
            email: existingUser.email,
            first_name: existingUser.first_name,
            last_name: existingUser.last_name,
            org_id: trashed ? null : existingUser.org_id,
            avatar_url: existingUser.avatar_url,
            trashed: false
          }
        ])

        if (insertError && insertError.code !== '23505') {
          throw insertError
        }
      }
      return true
    } else {
      const { error } = await supabase.from('users').upsert([{ id: userId, email: userEmail }], { onConflict: ['id'] })
      if (error) throw error
      return true
    }
  } catch (error) {
    console.error('Auth userLifecycle: ensureUserRecord error:', error)
    return false
  }
}

/**
 * Activate user by setting their status to 'active' after successful login
 * @param {string} userId - The user's unique id
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export const activateUserOnLogin = async (userId) => {
  try {
    if (!supabase) throw new Error('Supabase client not initialized')
    if (!userId) throw new Error('User ID is required')

    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('status')
      .eq('id', userId)
      .single()

    if (fetchError) {
      console.error('Auth userLifecycle: Error fetching user status:', fetchError)
      return false
    }

    if (currentUser?.status !== 'active') {
      const { error: updateError } = await supabase.from('users').update({ status: 'active' }).eq('id', userId)

      if (updateError) {
        console.error('Auth userLifecycle: Error activating user:', updateError)
        return false
      }

      console.log('Auth userLifecycle: User status updated to active for user:', userId)
    }

    return true
  } catch (error) {
    console.error('Auth userLifecycle: activateUserOnLogin error:', error)
    return false
  }
}
