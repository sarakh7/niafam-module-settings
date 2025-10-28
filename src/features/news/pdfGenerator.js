import { jsPDF } from "jspdf";
import "../../assets/fonts/Vazirmatn-Medium-normal"; // Vazir font
import i18next from "../../config/i18n";
import { getDirectionFromHTML, defaultSettings } from "../../config/settings";

/**
 * Generate PDF from article content
 * @returns {Promise<void>}
 */
export async function generatePDF() {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  // Detect current language and direction
  const currentLanguage = defaultSettings.language;
  const currentDirection = getDirectionFromHTML();
  const isRTL = currentDirection === 'rtl';

  // Set font based on language (Persian/Arabic use Vazir, others use default)
  const isPersianArabic = ['fa', 'ar'].includes(currentLanguage);
  if (isPersianArabic) {
    pdf.setFont("Vazirmatn-Medium");
  } else {
    pdf.setFont("helvetica"); // Default font for other languages
  }

  /**
   * Format Persian text for PDF generation
   * Converts half-spaces to regular spaces, adds spaces before punctuation,
   * converts English numbers to Persian, and reverses bracket direction
   * @param {string} text - Text to format
   * @returns {string} Formatted text
   */
  function formatPersianText(text) {
    return (
      text
        // Convert half-space to regular space
        .replace(/\u200C/g, " ") // ZWNJ (Zero Width Non-Joiner)
        .replace(/\u00A0/g, " ") // Non-breaking space

        // Add space before comma (if there isn't one)
        .replace(/(\S)،/g, "$1 ،")

        // Add space before period (if there isn't one)
        .replace(/(\S)\./g, "$1 .")

        // Convert English numbers to Persian
        .replace(/0/g, "۰")
        .replace(/1/g, "۱")
        .replace(/2/g, "۲")
        .replace(/3/g, "۳")
        .replace(/4/g, "۴")
        .replace(/5/g, "۵")
        .replace(/6/g, "۶")
        .replace(/7/g, "۷")
        .replace(/8/g, "۸")
        .replace(/9/g, "۹")

        // Reverse direction of parentheses, brackets, and braces for Persian (correct method)
        .replace(/\(/g, "TEMP_OPEN_PAREN")
        .replace(/\)/g, "TEMP_CLOSE_PAREN")
        .replace(/TEMP_OPEN_PAREN/g, ")")
        .replace(/TEMP_CLOSE_PAREN/g, "(")

        .replace(/\[/g, "TEMP_OPEN_BRACKET")
        .replace(/\]/g, "TEMP_CLOSE_BRACKET")
        .replace(/TEMP_OPEN_BRACKET/g, "]")
        .replace(/TEMP_CLOSE_BRACKET/g, "[")

        .replace(/\{/g, "TEMP_OPEN_BRACE")
        .replace(/\}/g, "TEMP_CLOSE_BRACE")
        .replace(/TEMP_OPEN_BRACE/g, "}")
        .replace(/TEMP_CLOSE_BRACE/g, "{")

        // Remove extra spaces
        .replace(/\s+/g, " ")

        // Trim leading and trailing spaces
        .trim()
    );
  }

  /**
   * Advanced Persian text formatting to fix punctuation position issues
   * Uses ZWNJ before punctuation marks to prevent displacement
   * @param {string} text - Text to format
   * @returns {string} Formatted text
   */
  function formatPersianTextAdvanced(text) {
    return (
      text
        // Convert half-space to regular space
        .replace(/\u200C/g, " ")
        .replace(/\u00A0/g, " ")

        // Use ZWNJ before punctuation marks to prevent displacement
        .replace(/(\S)\s*([،.])/g, "$1\u200C$2")

        // Convert numbers
        .replace(/[0-9]/g, function (match) {
          const persianNumbers = {
            0: "۰",
            1: "۱",
            2: "۲",
            3: "۳",
            4: "۴",
            5: "۵",
            6: "۶",
            7: "۷",
            8: "۸",
            9: "۹",
          };
          return persianNumbers[match];
        })

        // Reverse parentheses, brackets, and braces
        .replace(/\(/g, "TEMP_OPEN_PAREN")
        .replace(/\)/g, "TEMP_CLOSE_PAREN")
        .replace(/TEMP_OPEN_PAREN/g, ")")
        .replace(/TEMP_CLOSE_PAREN/g, "(")

        .replace(/\[/g, "TEMP_OPEN_BRACKET")
        .replace(/\]/g, "TEMP_CLOSE_BRACKET")
        .replace(/TEMP_OPEN_BRACKET/g, "]")
        .replace(/TEMP_CLOSE_BRACKET/g, "[")

        .replace(/\{/g, "TEMP_OPEN_BRACE")
        .replace(/\}/g, "TEMP_CLOSE_BRACE")
        .replace(/TEMP_OPEN_BRACE/g, "}")
        .replace(/TEMP_CLOSE_BRACE/g, "{")

        // Remove extra spaces
        .replace(/[ ]+/g, " ")
        .trim()
    );
  }

  // ---------- Article Title ----------
  const title =
    document.querySelector(".esprit-article__title")?.innerText.trim() || "";
  if (title) {
    // Style for title: larger font, bold, dark color
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0); // Black
    if (isPersianArabic) {
      pdf.setFont("Vazirmatn-Medium", "normal");
    } else {
      pdf.setFont("helvetica", "bold");
    }

    const titleText = isPersianArabic ? formatPersianTextAdvanced(title) : title;
    const calculatedpageWidth = isRTL ? pageWidth : pageWidth - 2 * margin;
    const titleLines = pdf.splitTextToSize(titleText, calculatedpageWidth);

    const titleX = isRTL ? pageWidth - margin : margin;
    const titleAlign = isRTL ? "right" : "left";
    pdf.text(titleLines, titleX, y, { align: titleAlign });
    y += titleLines.length * 10 + 8;

    // Add separator line under title
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 8;
  }

  // ---------- Article Lead/Subtitle ----------
  const lead =
    document
      .querySelector(".esprit-article__lead, .lead, .subtitle, .article-lead")
      ?.innerText.trim() || "";
  if (lead) {
    pdf.setFontSize(13);
    pdf.setTextColor(80, 80, 80); // Medium gray
    if (isPersianArabic) {
      pdf.setFont("Vazirmatn-Medium", "normal");
    } else {
      pdf.setFont("helvetica", "normal");
    }

    // Add background for lead
    const leadText = isPersianArabic ? formatPersianTextAdvanced(lead) : lead;
    const leadLines = pdf.splitTextToSize(leadText, pageWidth - 2 * margin);
    const leadHeight = leadLines.length * 7 + 8;

    // Light background for lead
    pdf.setFillColor(250, 250, 250);
    pdf.rect(margin, y - 4, pageWidth - 2 * margin, leadHeight, "F");

    const leadX = isRTL ? pageWidth - margin : margin;
    const leadAlign = isRTL ? "right" : "left";
    pdf.text(leadLines, leadX, y, { align: leadAlign });
    y += leadLines.length * 7 + 12;
  }

  // ---------- Main Article Image ----------
  const imgEl = document.querySelector(
    ".esprit-article__image-wrapper > img, .esprit-article__image-wrapper img"
  );
  if (imgEl && imgEl.src) {
    try {
      const imgData = await imageToBase64(imgEl.src);
      // const maxImgWidth = pageWidth - 2 * margin;
      const maxImgWidth = pageWidth - 2 * margin;
      const maxImgHeight = 80; // Maximum height in mm

      // Calculate image dimensions maintaining aspect ratio
      let imgWidth, imgHeight;
      const aspectRatio = imgEl.naturalWidth / imgEl.naturalHeight;

      if (aspectRatio > 1) {
        // Landscape
        imgWidth = Math.min(maxImgWidth, maxImgHeight * aspectRatio);
        imgHeight = imgWidth / aspectRatio;
      } else {
        // Portrait or square
        imgHeight = Math.min(maxImgHeight, maxImgWidth / aspectRatio);
        imgWidth = imgHeight * aspectRatio;
      }

      // Check if image fits on current page
      if (y + imgHeight + 20 > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }

      // Center the image
      const imgX = (pageWidth - imgWidth) / 2;

      // Add border around image
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.2);
      pdf.rect(imgX - 1, y - 1, imgWidth + 2, imgHeight + 2);

      pdf.addImage(imgData, "JPEG", imgX, y, imgWidth, imgHeight);
      y += imgHeight + 15;

      // Add image caption if exists
      const caption =
        imgEl.getAttribute("alt") || imgEl.getAttribute("title") || "";
      if (caption) {
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        if (isPersianArabic) {
          pdf.setFont("Vazirmatn-Medium", "normal");
        } else {
          pdf.setFont("helvetica", "italic");
        }
        const captionText = isPersianArabic ? formatPersianTextAdvanced(caption) : caption;
        const captionLines = pdf.splitTextToSize(
          captionText,
          pageWidth - 2 * margin
        );
        const captionX = isRTL ? pageWidth - margin : margin;
        const captionAlign = isRTL ? "right" : "left";
        pdf.text(captionLines, captionX, y, { align: captionAlign });
        y += captionLines.length * 6 + 10;
      }
    } catch (error) {
      console.error("Error loading image:", error);
      // Add placeholder text if image fails to load
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      const errorX = isRTL ? pageWidth - margin : margin;
      const errorAlign = isRTL ? "right" : "left";
      pdf.text(i18next.t("pdf.imageNotAvailable"), errorX, y, {
        align: errorAlign,
      });
      y += 15;
    }
  }

  // Main article content
  const contentElement = document.querySelector(
    ".esprit-article__main-content, .article-content, .main-content"
  );
  if (contentElement) {
    // Process paragraphs separately for better formatting
    const paragraphs = contentElement.querySelectorAll("p");

    pdf.setFontSize(12);
    pdf.setTextColor(40, 40, 40);
    if (isPersianArabic) {
      pdf.setFont("Vazirmatn-Medium", "normal");
    } else {
      pdf.setFont("helvetica", "normal");
    }

    // Use full width minus smaller margins for content
    const contentMargin = 15; // Smaller margin for content
    const contentWidth = isRTL ? pageWidth : pageWidth - 2 * contentMargin;

    const contentX = isRTL ? pageWidth - contentMargin : contentMargin;
    const contentAlign = isRTL ? "right" : "left";

    if (paragraphs.length > 0) {
      paragraphs.forEach((paragraph) => {
        const paragraphText = paragraph.innerText.trim();
        if (paragraphText) {
          const formattedText = isPersianArabic ? formatPersianTextAdvanced(paragraphText) : paragraphText;
          const textLines = pdf.splitTextToSize(formattedText, contentWidth);

          for (const line of textLines) {
            if (y + 10 > pageHeight - margin) {
              pdf.addPage();
              y = margin;
            }
            pdf.text(line, contentX, y, { align: contentAlign });
            y += 7;
          }
          y += 5; // Extra space between paragraphs
        }
      });
    } else {
      // Fallback to full content text
      const content = contentElement.innerText.trim();
      const formattedContent = isPersianArabic ? formatPersianTextAdvanced(content) : content;
      const textLines = pdf.splitTextToSize(formattedContent, contentWidth);

      for (const line of textLines) {
        if (y + 10 > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, contentX, y, { align: contentAlign });
        y += 7;
      }
    }
  }

  // Metadata at the end
  const metaDataFields = [
    { key: "author", selector: "#author", fallback: ".author, .writer" },
    {
      key: "publishDate",
      selector: "#publish-date",
      fallback: ".date, .publish-date",
    },
    {
      key: "photographer",
      selector: "#photographer",
      fallback: ".photographer",
    },
    {
      key: "videographer",
      selector: "#videographer",
      fallback: ".videographer",
    },
    { key: "editor", selector: "#editor", fallback: ".editor" },
    { key: "newsCode", selector: "#news-code", fallback: ".news-code" },
    { key: "newsGroup", selector: "#news-groups", fallback: ".news-groups" },
  ];

  const metaData = {};
  metaDataFields.forEach((field) => {
    const value =
      document.getElementById(field.selector.replace("#", ""))?.innerText ||
      document.querySelector(field.fallback)?.innerText ||
      "";
    if (value.trim()) {
      metaData[i18next.t(`metadata.${field.key}`)] = value;
    }
  });

  // Filter out empty values
  const validEntries = Object.entries(metaData).filter(
    ([_, value]) => value.trim() !== ""
  );

  if (validEntries.length > 0) {
    y += 15; // Extra space before metadata

    const lineHeight = 8;
    const headerHeight = 12;
    const boxPadding = 8;
    const boxHeight =
      headerHeight + validEntries.length * lineHeight + boxPadding;

    // Check if metadata box fits on current page
    if (y + boxHeight > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }

    // Background for metadata box
    pdf.setFillColor(248, 248, 248);
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(
      margin,
      y - 5,
      pageWidth - 2 * margin,
      boxHeight,
      2,
      2,
      "FD"
    );

    // Header for metadata
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    if (isPersianArabic) {
      pdf.setFont("Vazirmatn-Medium", "normal");
    } else {
      pdf.setFont("helvetica", "bold");
    }
    const metaHeaderX = isRTL ? pageWidth - margin - 5 : margin + 5;
    const metaHeaderAlign = isRTL ? "right" : "left";
    pdf.text(i18next.t("pdf.contentInfo"), metaHeaderX, y + 5, {
      align: metaHeaderAlign,
    });
    y += headerHeight;

    // Metadata entries
    pdf.setFontSize(11);
    pdf.setTextColor(60, 60, 60);
    if (isPersianArabic) {
      pdf.setFont("Vazirmatn-Medium", "normal");
    } else {
      pdf.setFont("helvetica", "normal");
    }

    const metaX = isRTL ? pageWidth - margin - 5 : margin + 5;
    const metaAlign = isRTL ? "right" : "left";

    for (const [label, value] of validEntries) {
      if (value.trim()) {
        const line = `${label}: ${value}`;
        const formattedLine = isPersianArabic ? formatPersianTextAdvanced(line) : line;
        pdf.text(formattedLine, metaX, y, {
          align: metaAlign,
        });
        y += lineHeight;
      }
    }
  }

  // Page footer
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.setTextColor(120, 120, 120);
    if (isPersianArabic) {
      pdf.setFont("Vazirmatn-Medium", "normal");
    } else {
      pdf.setFont("helvetica", "normal");
    }

    const pageText = `${i18next.t("pdf.page")} ${i} ${i18next.t(
      "pdf.of"
    )} ${totalPages}`;
    const formattedPageText = isPersianArabic ? formatPersianTextAdvanced(pageText) : pageText;
    pdf.text(
      formattedPageText,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    // Add generation date
    const now = new Date();
    const dateStr = isPersianArabic ? now.toLocaleDateString("fa-IR") : now.toLocaleDateString("en-US");
    const dateText = `${i18next.t("pdf.generationDate")}: ${dateStr}`;
    const formattedDateText = isPersianArabic ? formatPersianTextAdvanced(dateText) : dateText;
    const dateX = isRTL ? pageWidth - margin : margin;
    const dateAlign = isRTL ? "right" : "left";
    pdf.text(
      formattedDateText,
      dateX,
      pageHeight - 10,
      {
        align: dateAlign,
      }
    );
  }

  // Save file  
  let safeTitle = title.replace(/[^آ-ی0-9a-zA-Z\s-]/g, "").trim();
  if (safeTitle.length > 150) {
    safeTitle = safeTitle.substring(0, 150);
  }
  const filename = `${safeTitle}.pdf`;

  pdf.save(filename);
}

/**
 * Convert image to base64 with error handling
 * @param {string} url - Image URL
 * @returns {Promise<string>} Base64 data URL
 */
async function imageToBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Handle CORS issues
    img.crossOrigin = "anonymous";

    img.onload = function () {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size to image size
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Convert to base64
        const dataURL = canvas.toDataURL("image/jpeg", 0.85); // 85% quality
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = (error) => {
      console.error("Image loading error:", error);
      reject(new Error("Failed to load image"));
    };

    // Handle relative URLs
    if (url.startsWith("/")) {
      img.src = window.location.origin + url;
    } else if (!url.startsWith("http")) {
      img.src = window.location.origin + "/" + url;
    } else {
      img.src = url;
    }
  });
}

/**
 * Initialize PDF generator functionality
 * @returns {void}
 */
export function initPdfGenerator() {
  const button = document.getElementById("create-pdf");

  if (!button) {
    console.warn("PDF generator button not found: #create-pdf");
    return;
  }

  button.addEventListener("click", async () => {
    try {
      button.disabled = true;
      button.classList.add("disabled");

      await generatePDF();

      button.disabled = false;
      button.classList.remove("disabled");
    } catch (error) {
      console.error("PDF generation error:", error);
      alert(i18next.t("pdf.generationError"));
      button.disabled = false;
      button.classList.remove("disabled");
    }
  });
}
