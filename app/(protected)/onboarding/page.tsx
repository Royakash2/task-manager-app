import { Button } from '@/components/ui/button'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'
import React from 'react'

export default function OnboardingPage() {
    return (
        <div>
            <h1 className='text-4xl font-bold'>onboarding page</h1>
             <Button> <LogoutLink>Log out</LogoutLink></Button>
        </div>
      
    )
}