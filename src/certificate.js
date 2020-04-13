import { PDFDocument, StandardFonts } from 'pdf-lib'
import QRCode from 'qrcode'

import * as profile from '../src/profile.json'

import * as fs from 'fs'

const generateQR = async text => {
  try {
    var opts = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
    }
    return await QRCode.toDataURL(text, opts)
  } catch (err) {
    console.error(err)
  }
}

function idealFontSize (font, text, maxWidth, minSize, defaultSize) {
  let currentSize = defaultSize
  let textWidth = font.widthOfTextAtSize(text, defaultSize)

  while (textWidth > maxWidth && currentSize > minSize) {
    textWidth = font.widthOfTextAtSize(text, --currentSize)
  }

  return (textWidth > maxWidth) ? null : currentSize
}

export async function generatePdf() {
  const creationDate = new Date().toLocaleDateString('fr-FR')
  const creationHour = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h')

  const datesortie = creationDate
  const heuresortie = creationHour

  const releaseHours = String(heuresortie).substring(0, 2)
  const releaseMinutes = String(heuresortie).substring(3, 5)

  const data = [
    `Cree le: ${creationDate} a ${creationHour}`,
    `Nom: ${profile.lastname}`,
    `Prenom: ${profile.firstname}`,
    `Naissance: ${profile.birthday} a ${profile.lieunaissance}`,
    `Adresse: ${profile.address} ${profile.zipcode} ${profile.town}`,
    `Sortie: ${datesortie} a ${releaseHours}h${releaseMinutes}`,
    `Motifs: ${profile.reasons}`,
  ].join('; ')

  const buffer = fs.readFileSync(fs.realpathSync('./src/certificate.pdf'), { encoding: 'base64' })
  const pdfDoc = await PDFDocument.load(buffer)
  const page1 = pdfDoc.getPages()[0]

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const drawText = (text, x, y, size = 11) => {
    page1.drawText(text, { x, y, size, font })
  }

  drawText(`${profile.firstname} ${profile.lastname}`, 123, 686)
  drawText(profile.birthday, 123, 661)
  drawText(profile.lieunaissance, 92, 638)
  drawText(`${profile.address} ${profile.zipcode} ${profile.town}`, 134, 613)

  if (profile.reasons.includes('travail')) {
    drawText('x', 76, 527, 19)
  }
  if (profile.reasons.includes('courses')) {
    drawText('x', 76, 478, 19)
  }
  if (profile.reasons.includes('sante')) {
    drawText('x', 76, 436, 19)
  }
  if (profile.reasons.includes('famille')) {
    drawText('x', 76, 400, 19)
  }
  if (profile.reasons.includes('sport')) {
    drawText('x', 76, 345, 19)
  }
  if (profile.reasons.includes('judiciaire')) {
    drawText('x', 76, 298, 19)
  }
  if (profile.reasons.includes('missions')) {
    drawText('x', 76, 260, 19)
  }
  let locationSize = idealFontSize(font, profile.town, 83, 7, 11)

  drawText(profile.town, 111, 226, locationSize)

  if (profile.reasons !== '') {
    // Date sortie
    drawText(`${datesortie}`, 92, 200)
    drawText(releaseHours, 200, 201)
    drawText(releaseMinutes, 220, 201)
  }

  // Date création
  drawText('Date de création:', 464, 150, 7)
  drawText(`${creationDate} à ${creationHour}`, 455, 144, 7)

  const generatedQR = await generateQR(data)

  const qrImage = await pdfDoc.embedPng(generatedQR)

  page1.drawImage(qrImage, {
    x: page1.getWidth() - 170,
    y: 155,
    width: 100,
    height: 100,
  })

  pdfDoc.addPage()
  const page2 = pdfDoc.getPages()[1]
  page2.drawImage(qrImage, {
    x: 50,
    y: page2.getHeight() - 350,
    width: 300,
    height: 300,
  })

  const pdfBytes = await pdfDoc.save()
  fs.writeFileSync('./certificate.pdf', pdfBytes)
}
