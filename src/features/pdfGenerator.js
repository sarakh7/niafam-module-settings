import { jsPDF } from "jspdf";
import "../assets/fonts/Vazirmatn-Medium-normal"; // فونت وزیر

export async function generatePDF() {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  pdf.setFont("Vazirmatn-Medium");

  function formatPersianText(text) {
    return (
      text
        // تبدیل نیم‌فاصله به فاصله معمولی
        .replace(/\u200C/g, " ") // نیم‌فاصله (ZWNJ)
        .replace(/\u00A0/g, " ") // نان‌بریکینگ اسپیس

        // اضافه کردن فاصله قبل از کاما (اگر قبلش فاصله نباشد)
        .replace(/(\S)،/g, "$1 ،")

        // اضافه کردن فاصله قبل از نقطه (اگر قبلش فاصله نباشد)
        .replace(/(\S)\./g, "$1 .")

        // تبدیل اعداد انگلیسی به فارسی
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

        // تبدیل جهت پرانتز، براکت و آکولاد برای فارسی (روش صحیح)
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

        // حذف فاصله‌های اضافی
        .replace(/\s+/g, " ")

        // تمیز کردن فاصله‌های ابتدا و انتهای رشته
        .trim()
    );
  }

  // تابع بهبود یافته برای حل مشکل نقطه در ابتدای خط
  function formatPersianTextAdvanced(text) {
    return (
      text
        // تبدیل نیم‌فاصله به فاصله معمولی
        .replace(/\u200C/g, " ")
        .replace(/\u00A0/g, " ")

        // استفاده از ZWNJ قبل از علائم نگارشی برای جلوگیری از جابجایی
        .replace(/(\S)\s*([،.])/g, "$1\u200C$2")

        // تبدیل اعداد
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

        // تبدیل پرانتز، براکت و آکولاد
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

        // حذف فاصله‌های اضافی
        .replace(/[ ]+/g, " ")
        .trim()
    );
  }

  // ---------- ✅ عنوان مقاله (Title) ----------
  const title =
    document.querySelector(".esprit-article__title")?.innerText.trim() || "";
  if (title) {
    // Style for title: larger font, bold, dark color
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0); // Black
    pdf.setFont("Vazirmatn-Medium", "normal"); // Remove bold as it may not be supported

    const titleLines = pdf.splitTextToSize(
      formatPersianTextAdvanced(title),
      pageWidth
    );
    pdf.text(titleLines, pageWidth - margin, y, { align: "right" });
    y += titleLines.length * 10 + 8;

    // Add separator line under title
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 8;
  }

  // ---------- ✅ لید مقاله (Lead/Subtitle) ----------
  const lead =
    document
      .querySelector(".esprit-article__lead, .lead, .subtitle, .article-lead")
      ?.innerText.trim() || "";
  if (lead) {
    pdf.setFontSize(13);
    pdf.setTextColor(80, 80, 80); // Medium gray
    pdf.setFont("Vazirmatn-Medium", "normal");

    // Add background for lead
    const leadLines = pdf.splitTextToSize(lead, pageWidth);
    const leadHeight = leadLines.length * 7 + 8;

    // Light background for lead
    pdf.setFillColor(250, 250, 250);
    pdf.rect(margin, y - 4, pageWidth, leadHeight, "F");

    pdf.text(leadLines, pageWidth - margin, y, { align: "right" });
    y += leadLines.length * 7 + 12;
  }

  // ---------- ✅ عکس اصلی مقاله ----------
  const imgEl = document.querySelector(
    ".esprit-article__image-wrapper > img, .esprit-article__image-wrapper img"
  );
  if (imgEl && imgEl.src) {
    try {
      const imgData = await imageToBase64(imgEl.src);
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
        pdf.setFont("Vazirmatn-Medium", "italic");
        const captionLines = pdf.splitTextToSize(
          caption,
          pageWidth - 2 * margin
        );
        pdf.text(captionLines, pageWidth - margin, y, { align: "right" });
        y += captionLines.length * 6 + 10;
      }
    } catch (error) {
      console.error("Error loading image:", error);
      // Add placeholder text if image fails to load
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text("[تصویر قابل نمایش نیست]", pageWidth - margin, y, {
        align: "right",
      });
      y += 15;
    }
  }

  // ---------- ✅ متن اصلی مقاله ----------
  const contentElement = document.querySelector(
    ".esprit-article__main-content, .article-content, .main-content"
  );
  if (contentElement) {
    // Process paragraphs separately for better formatting
    const paragraphs = contentElement.querySelectorAll("p");

    pdf.setFontSize(12);
    pdf.setTextColor(40, 40, 40);
    pdf.setFont("Vazirmatn-Medium", "normal");

    // Use full width minus smaller margins for content
    const contentMargin = 15; // Smaller margin for content
    const contentWidth = pageWidth;

    if (paragraphs.length > 0) {
      paragraphs.forEach((paragraph) => {
        const paragraphText = paragraph.innerText.trim();
        if (paragraphText) {
          const textLines = pdf.splitTextToSize(paragraphText, contentWidth);

          for (const line of textLines) {
            if (y + 10 > pageHeight - margin) {
              pdf.addPage();
              y = margin;
            }
            pdf.text(
              formatPersianTextAdvanced(line),
              pageWidth - contentMargin,
              y,
              { align: "right", direction: "rtl" }
            );
            // pdf.text(line, pageWidth - contentMargin, y, { align: "right" });
            y += 7;
          }
          y += 5; // Extra space between paragraphs
        }
      });
    } else {
      // Fallback to full content text
      const content = contentElement.innerText.trim();
      const textLines = pdf.splitTextToSize(content, contentWidth);

      for (const line of textLines) {
        if (y + 10 > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(
          formatPersianTextAdvanced(line),
          pageWidth - contentMargin,
          y,
          { align: "right" }
        );
        y += 7;
      }
    }
  }

  // ---------- ✅ اطلاعات متا در انتها ----------
  const metaData = {
    نویسنده:
      document.getElementById("author")?.innerText ||
      document.querySelector(".author, .writer")?.innerText ||
      "",
    "تاریخ انتشار":
      document.getElementById("publish-date")?.innerText ||
      document.querySelector(".date, .publish-date")?.innerText ||
      "",
    عکاس:
      document.getElementById("photographer")?.innerText ||
      document.querySelector(".photographer")?.innerText ||
      "",
    فیلمبردار:
      document.getElementById("videographer")?.innerText ||
      document.querySelector(".videographer")?.innerText ||
      "",
    تدوینگر:
      document.getElementById("editor")?.innerText ||
      document.querySelector(".editor")?.innerText ||
      "",
    "کد خبر":
      document.getElementById("news-code")?.innerText ||
      document.querySelector(".news-code")?.innerText ||
      "",
    "گروه خبری":
      document.getElementById("news-groups")?.innerText ||
      document.querySelector(".news-groups")?.innerText ||
      "",
  };

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
    pdf.setFont("Vazirmatn-Medium", "normal"); // Remove bold as it may not be supported
    pdf.text("اطلاعات تولید محتوا", pageWidth - margin - 5, y + 5, {
      align: "right",
    });
    y += headerHeight;

    // Metadata entries
    pdf.setFontSize(11);
    pdf.setTextColor(60, 60, 60);
    pdf.setFont("Vazirmatn-Medium", "normal");

    for (const [label, value] of validEntries) {
      if (value.trim()) {
        const line = `${label}: ${value}`;
        pdf.text(formatPersianTextAdvanced(line), pageWidth - margin - 5, y, {
          align: "right",
        });
        y += lineHeight;
      }
    }
  }

  // ---------- ✅ فوتر صفحه ----------
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.setTextColor(120, 120, 120);
    pdf.setFont("Vazirmatn-Medium", "normal");

    const pageText = `صفحه ${i} از ${totalPages}`;
    pdf.text(
      formatPersianTextAdvanced(pageText),
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    // Add generation date
    const now = new Date();
    const dateStr = now.toLocaleDateString("fa-IR");
    pdf.text(`تاریخ تولید: ${dateStr}`, margin, pageHeight - 10, {
      align: "left",
    });
  }

  // ---------- ✅ ذخیره فایل ----------
  let safeTitle = title.replace(/[^آ-ی0-9a-zA-Z\s-]/g, "").trim();
  if (safeTitle.length > 150) {
    safeTitle = safeTitle.substring(0, 150);
  }
  const filename = `${safeTitle}.pdf`;

  pdf.save(filename);
}

// 🖼 تبدیل تصویر به base64 با بهبود خطاها
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

export function initPdfGenerator() {
  const button = document.getElementById("create-pdf");
  if (button) {
    button.addEventListener("click", async () => {
      try {
        button.disabled = true;
        button.classList.add("disabled");
        // button.textContent = "در حال تولید PDF...";

        await generatePDF();

        // button.textContent = "ایجاد PDF";
        button.disabled = false;
        button.classList.remove("disabled");
      } catch (error) {
        console.error("PDF generation error:", error);
        alert("خطا در تولید PDF. لطفاً دوباره تلاش کنید.");
        //button.textContent = "ایجاد PDF";
        button.disabled = false;
        button.classList.remove("disabled");
      }
    });
  }
}
