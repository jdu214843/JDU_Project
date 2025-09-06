import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function HelpCenterPage() {
  const faqs = [
    { q: 'How long does analysis take?', a: 'Typically about 1 minute as we simulate AI processing.' },
    { q: 'What images should I upload?', a: 'Clear photos of the soil surface and a small dug profile.' },
    { q: 'Can I edit my profile?', a: 'Yes, use the Dashboard → Profile tab.' },
  ]

  return (
    <div>
      {faqs.map((f, i) => (
        <Accordion key={i}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>{f.q}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">{f.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

