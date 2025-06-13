import React from 'react';
import { Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import logo from '../../assets/logo.png'; // Replace with your actual logo path

export default function VPAPdfGenerate({ jobDetail, VPAPData }) {
    console.log("jobDetail", jobDetail);
    console.log("VPAPData", VPAPData);

    const data = {
        title: 'VPAP SHEET',
        Awb: jobDetail?.AWB,
        driverName: jobDetail?.driverName,
        companyName: jobDetail?.companyName,
        date: jobDetail?.date,
        description: 'A: Consignment Packaging for airfreight perishable must be verified for compliance with one or more of the following secure packaging options.',
        sections: VPAPData?.sections
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        const topMargin = 20;
        const sectionMargin = 10;
        const maxWidth = pageWidth - margin * 2;
        const lineHeight = 7;
        const yesNoMargin = 5; // Left margin after "Yes" or "No"
        const optionMargin = 7; // Additional margin after each option

        const addPageIfNeeded = (doc, currentY, spaceNeeded) => {
            if (currentY + spaceNeeded > pageHeight - margin) {
                doc.addPage();
                currentY = margin;
            }
            return currentY;
        };

        // Load the logo image
        const img = new Image();
        img.src = logo;
        img.onload = function () {
            // Add the logo image at the top right corner
            const logoWidth = 40; // Adjust the width of the logo
            const logoHeight = 20; // Adjust the height of the logo
            const logoX = pageWidth - margin - logoWidth;
            const logoY = topMargin;

            if (data) {
                doc.setFont('Helvetica', 'bold');
                doc.setFontSize(20);

                const titleWidth = doc.getStringUnitWidth(data.title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                const pageCenter = pageWidth / 2;
                const titleCenter = pageCenter - titleWidth / 2;
                doc.text(data.title, titleCenter, topMargin);
                doc.line(titleCenter, topMargin + 2, titleCenter + titleWidth, topMargin + 2);

                // Add the logo image
                doc.addImage(img, 'PNG', logoX, logoY, logoWidth, logoHeight);

                doc.setFontSize(12);

                const partWidth = pageWidth / 2;

                const fields = [
                    { label: 'Awb', value: data.Awb },
                    { label: 'Name', value: data?.driverName },
                    { label: 'Company ', value: data.companyName },
                    { label: 'Date & Time', value: data.date },
                ];

                let currentY = topMargin + logoHeight + sectionMargin;
                fields.forEach((field, index) => {
                    const fieldLabelWidth = doc.getStringUnitWidth(`${field.label}: `) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                    const fieldValueWidth = doc.getStringUnitWidth(field.value) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                    const posX = margin + (index % 2) * partWidth;
                    doc.text(`${field.label}: `, posX, currentY);
                    doc.text(field.value, posX + fieldLabelWidth, currentY);
                    doc.line(posX + fieldLabelWidth, currentY + 2, posX + fieldLabelWidth + fieldValueWidth, currentY + 2);

                    if (index % 2 === 1) {
                        currentY += lineHeight;
                    }
                });

                currentY += lineHeight + sectionMargin;
                doc.setLineWidth(0.1);
                doc.setDrawColor(0);
                doc.setLineDash([1, 1], 0);
                doc.line(margin, currentY, pageWidth - margin, currentY);

                doc.setFont('Helvetica', 'normal');
                const descriptionText = doc.splitTextToSize(`Description: ${data.description}`, maxWidth);
                currentY += lineHeight + sectionMargin;
                descriptionText.forEach(line => {
                    currentY = addPageIfNeeded(doc, currentY, lineHeight);
                    doc.text(line, margin, currentY);
                    currentY += lineHeight;
                });

                currentY += sectionMargin;
                data?.sections?.forEach(section => {
                    currentY = addPageIfNeeded(doc, currentY, lineHeight);
                    doc.setFont('Helvetica', 'bold');
                    doc.text(section.title, margin, currentY);
                    currentY += lineHeight;

                    doc.setFont('Helvetica', 'normal');
                    section.options.forEach(option => {
                        const yesNoText = option.checked ? 'Yes' : 'No';
                        const wrappedText = doc.splitTextToSize(`${option.label}`, maxWidth);

                        wrappedText.forEach((line, index) => {
                            currentY = addPageIfNeeded(doc, currentY, lineHeight);
                            doc.text(line, margin, currentY);

                            if (index === wrappedText.length - 1) {
                                const textWidth = doc.getTextWidth(line);
                                doc.setTextColor(255, 0, 0); // Red color for Yes and No
                                doc.text(yesNoText, margin + textWidth + yesNoMargin, currentY); // Yes or No part
                                doc.setTextColor(0, 0, 0); // Reset to black for the rest
                            }
                            currentY += lineHeight;
                        });

                        currentY += optionMargin; // Add distance after each option
                    });

                    if (section.damage) {
                        const damageText = `Damage: `;
                        const textWidth = doc.getTextWidth(damageText);
                        doc.text(damageText, margin, currentY);

                        doc.setTextColor(255, 0, 0); 
                        doc.text(section.damage.yes ? 'Yes' : 'No', margin + textWidth, currentY); 
                        doc.setTextColor(0, 0, 0); 

                        currentY += lineHeight + sectionMargin;
                    } else {
                        currentY += lineHeight + sectionMargin;
                    }

                });

                // Add verification section at the bottom
                const spaceForVerification = 2 * lineHeight + sectionMargin;
                currentY = addPageIfNeeded(doc, currentY, spaceForVerification);
                // doc.text('Verified By ______________________________', margin, currentY);
                // doc.text('Signature __________________________', margin + partWidth, currentY);
                // currentY += lineHeight;
                // doc.text('Date __________________________________', margin, currentY);
                // doc.text('Time ____________________________', margin + partWidth, currentY);
            }

            doc.save('document.pdf');
        };
    };

    return (
        <>
            <Button variant="success" className='text-white' onClick={generatePDF}>
                Download VPAP PDF
            </Button>
        </>
    );
}
