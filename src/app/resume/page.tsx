import PdfViewer from "@/components/PdfViewer";
import ResumeActions from "@/components/ResumeActions";

const FILE = "/Sagnik-Sahoo-AI-Engineer.pdf";

export default function Resume() {
  return (
    <>
      <PdfViewer file={FILE} />
      <ResumeActions file={FILE} />
    </>
  );
}
