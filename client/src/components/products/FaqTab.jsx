import React from 'react'
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function FaqTab() {
  const faqData = [
    {
      id: 'faq-1',
      question: 'Sensorlar qanday ulanadi?',
      answer: "Sensorlar Wi-Fi, Bluetooth yoki LoRa orqali ulanadi. Har bir sensor o'z mobil ilovasiga ega.",
    },
    {
      id: 'faq-2',
      question: 'Wi-Fi kerakmi?',
      answer: "Ba'zi sensorlar Wi-Fi talab qiladi, lekin LoRa sensorlar internet aloqasisiz ham ishlaydi.",
    },
    {
      id: 'faq-3',
      question: 'Batareya qancha vaqt ishlaydi?',
      answer: "Sensor turiga qarab 6 oydan 2 yilgacha. Batareya holati mobil ilovada ko'rsatiladi.",
    },
    {
      id: 'faq-4',
      question: "Qanday tavsiyalar beriladi?",
      answer: "Sug'orish vaqti, o'g'it berish, kasallik oldini olish va hosil yig'ish vaqti haqida tavsiyalar.",
    },
  ]

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {faqData.map((item) => (
        <Accordion key={item.id} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

