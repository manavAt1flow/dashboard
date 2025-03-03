'use client'

import { updateTeamNameAction } from '@/server/team/team-actions'
import { AuthFormMessage } from '@/features/auth/form-message'
import { Button } from '@/ui/primitives/button'
import { Input } from '@/ui/primitives/input'
import { Skeleton } from '@/ui/primitives/skeleton'
import { useSelectedTeam, useTeams } from '@/lib/hooks/use-teams'
import { useTimeoutMessage } from '@/lib/hooks/use-timeout-message'
import { AnimatePresence } from 'motion/react'
import { useEffect } from 'react'
import { useState } from 'react'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { CardDescription, CardTitle } from '@/ui/primitives/card'

export function TeamSettingsForm() {
  const { refetch: refetchTeams } = useTeams()
  const team = useSelectedTeam()
  const [teamName, setTeamName] = useState(team?.name ?? '')
  const [message, setMessage] = useTimeoutMessage()

  useEffect(() => {
    if (!team) return
    setTeamName(team.name)
  }, [team])

  const { mutate: updateName, isPending } = useMutation({
    mutationFn: async () => {
      if (!team) {
        throw new Error('No team selected')
      }

      if (!z.string().min(1).safeParse(teamName).success) {
        throw new Error('Name cannot be empty')
      }

      const response = await updateTeamNameAction({
        teamId: team.id,
        name: teamName,
      })

      if (response.type === 'error') {
        throw new Error(response.message)
      }

      return response
    },
    onSuccess: async () => {
      await refetchTeams()
      setMessage({ success: 'Team name updated' })
    },
    onError: (error: Error) => {
      setMessage({ error: error.message })
    },
  })

  return (
    <section>
      <div className="mb-6 flex flex-col gap-1">
        <CardTitle>Team Name</CardTitle>
        <CardDescription>
          Change your team name to display on your invoices and receipts
        </CardDescription>
      </div>
      <div>
        {team ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              updateName()
            }}
            className="flex items-center gap-2"
          >
            <Input
              placeholder="Acme, Inc."
              className="max-w-[14rem] flex-1"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <Button
              loading={isPending}
              disabled={teamName === team?.name}
              type="submit"
              variant="outline"
            >
              Save
            </Button>
          </form>
        ) : (
          <Skeleton className="h-10 w-[17rem]" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {message && <AuthFormMessage className="mt-4" message={message} />}
        </AnimatePresence>
      </div>
    </section>
  )
}
