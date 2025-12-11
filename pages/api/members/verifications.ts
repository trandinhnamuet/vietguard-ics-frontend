import type { NextApiRequest, NextApiResponse } from 'next'

interface MemberVerification {
  id: number
  full_name: string
  phone: string
  company_name: string
  note: string
  member_email: string
  created_at: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MemberVerification[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Call backend API to get member verifications 
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
    const response = await fetch(`${backendUrl}/members/verifications/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error: any) {
    console.error('Error fetching member verifications:', error)
    return res.status(500).json({ error: 'Failed to fetch member verifications' })
  }
}