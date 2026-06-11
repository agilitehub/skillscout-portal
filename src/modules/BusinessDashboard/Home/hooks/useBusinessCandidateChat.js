// Global Instructions Rule Applied!
// Frontend Instructions Rule Applied!
import { useMemo } from 'react'
import { useChatSession } from '../../../../core/components'
import { createBusinessOpenClawAdapter } from '../../../../lib/chat/adapters/businessOpenClawAdapter'

/**
 * Business Dashboard recruiter chat for one potential-candidate match.
 * @param {{ id?: string, name?: string, Username?: string }|null} recruiterUser
 * @param {object} cvContext — from fetchMatchedCandidateCvContext (required)
 */
export const useBusinessCandidateChat = (recruiterUser = null, cvContext = null) => {
  const chatService = useMemo(() => {
    if (!cvContext?.matchId || !cvContext?.orgId || !recruiterUser?.id) {
      return null
    }

    return createBusinessOpenClawAdapter({
      orgId: cvContext.orgId,
      recruiterUserId: recruiterUser.id,
      matchId: cvContext.matchId,
      welcomeMeta: {
        candidateName: cvContext.candidateName,
        jobListingTitle: cvContext.jobListingTitle
      }
    })
  }, [cvContext, recruiterUser?.id])

  return useChatSession(recruiterUser, {
    chatService,
    context: cvContext
  })
}

export default useBusinessCandidateChat
