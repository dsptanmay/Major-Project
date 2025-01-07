"use client";
import React from "react";
import { format } from "date-fns";
import { PDFDocument, StandardFonts, rgb, PageSizes } from "pdf-lib";

import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllReadEvents } from "@/hooks/history/use-get-all-read-events";

function DownloadAllReadEventsButton({
  userId,
}: {
  userId: string | undefined;
}) {
  const { data: records, status, refetch } = useGetAllReadEvents(userId);
  if (!userId) return null;

  const generatePDF = async (data: typeof records) => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.setTitle(`Read Events for user ${userId}`);
    pdfDoc.setCreationDate(new Date());

    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const page = pdfDoc.addPage(PageSizes.A4);
    page.setFont(timesRomanFont);

    const startX = 50;
    let startY = PageSizes.A4[1] - 50;
    const lineHeight = 25;
    const cellWidth = 500;

    page.drawText("Read Events", {
      x: startX,
      y: startY,
      size: 14,
      color: rgb(0, 0, 0),
    });

    startY -= lineHeight;

    page.drawText("ID", {
      x: startX,
      y: startY,
      size: 12,
      color: rgb(0, 0, 0),
    });
    page.drawText("Description", {
      x: startX + 50,
      y: startY,
      size: 12,
      color: rgb(0, 0, 0),
    });
    page.drawText("Performed At", {
      x: startX + 400,
      y: startY,
      size: 12,
      color: rgb(0, 0, 0),
    });

    // Draw a horizontal line below the header
    startY -= lineHeight / 2;

    data!.forEach((record) => {
      startY -= lineHeight;
      page.drawText(record.id.slice(0, 8), { x: startX, y: startY, size: 10 });
      page.drawText(record.description, {
        x: startX + 50,
        y: startY,
        size: 10,
      });
      page.drawText(format(new Date(record.performed_at), "HH:m a, do MMM"), {
        x: startX + 400,
        y: startY,
        size: 10,
      });

      // Draw a horizontal line below each record
      startY -= lineHeight;
      page.drawLine({
        start: { x: startX, y: startY },
        end: { x: startX + cellWidth, y: startY },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    });

    // Save the PDF and write it to a file
    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "document.pdf";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleDownload = async () => {
    await refetch();
    if (status === "success") generatePDF(records);
  };
  return (
    <Button
      onClick={handleDownload}
      className="flex items-start space-x-3 bg-[#FEF2E8] font-base"
      variant="noShadow"
    >
      <DownloadIcon className="size-4" />
      <h1>Download PDF</h1>
    </Button>
  );
}

export default DownloadAllReadEventsButton;
