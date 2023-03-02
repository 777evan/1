const userName = document.getElementById("name");
const submitBtn = document.getElementById("submitBtn");

const { PDFDocument, rgb, degrees } = PDFLib;


const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

submitBtn.addEventListener("click", () => {
  const val = capitalize(userName.value);

  //check if the text is empty or not
  if (val.trim() !== "" && userName.checkValidity()) {
    // console.log(val);
    generatePDF(val);
  } else {
    userName.reportValidity();
  }
});

const generatePDF = async (name) => {
  const existingPdfBytes = await fetch("./assets/images/certificate.pdf").then((res) =>
    res.arrayBuffer()
  );

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  //get font
  const fontBytes = await fetch("./Amiri-Regular.ttf").then((res) =>
    res.arrayBuffer()
  );

  // Embed our custom font in the document
  const AmiriFont = await pdfDoc.embedFont(fontBytes);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Draw a string of Arabic text diagonally across the first page
  const { width, height } = firstPage.getSize();
  const fontSize = 40;
  const text = name;
  const x = width / 2 - AmiriFont.widthOfTextAtSize(text, fontSize) / 2;
  const y = height / 2 - fontSize / 2;
  firstPage.drawText(text, {
    x,
    y,
    font: AmiriFont,
    size: fontSize,
    color: rgb(0.2, 0.84, 0.67),
    lineHeight: 1.5,
    textAlign: "center",
    direction: "rtl",
    rotate: degrees(-45),
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  console.log("Done creating");

  var file = new File(
    [pdfBytes],
    "Participation Certificate.pdf",
    {
      type: "application/pdf;charset=utf-8",
    }
  );
  saveAs(file);
};
