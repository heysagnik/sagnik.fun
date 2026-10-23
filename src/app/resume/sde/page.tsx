import PdfViewer from "@/components/PdfViewer";
import ResumeActions from "@/components/ResumeActions";

const FILE = "/Sagnik-Sahoo-SDE.pdf";

export default function ResumeSde() {
  return (
    <>
      <PdfViewer file={FILE} />
      <ResumeActions file={FILE} />
    </>
  );
}
