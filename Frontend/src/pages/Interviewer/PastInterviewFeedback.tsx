import domtoimage from "dom-to-image";
import jsPDF from "jspdf";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { FetchFeedbackDetailsAPI } from "@/api/interviewerApis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IFeedback, IInterviewee } from "@/utils/types";
import Loading from "../Loading";
import NotFound from "../NotFound";

export default function PastInterviewFeedback() {
  const { feedbackId } = useParams<string>();

  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState<IInterviewee>();
  const [feedback, setFeedback] = useState<IFeedback>();

  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      try {
        const response =
          feedbackId && (await FetchFeedbackDetailsAPI(feedbackId));
        if (!response.success) {
          toast.error(response.message);
          return;
        }
        setCandidate(response.feedback.interviewee);
        delete response.feedback.interviewee;
        setFeedback(response.feedback);
      } catch (error) {
        console.log("Error", error);
        toast.error(
          "Error occurred while fetching the feedback. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbackDetails();
  }, []);

  const captureAndSaveAsPDF = () => {
    const element = document.getElementById("pdf-content");

    domtoimage
      .toPng(element)
      .then((dataUrl) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const pageHeight = 297; // A4 height in mm
        const imgWidth = 210;
        const imgHeight =
          (element.offsetHeight * imgWidth) / element.offsetWidth;

        let yPosition = 0;

        while (yPosition < imgHeight) {
          pdf.addImage(dataUrl, "PNG", 0, yPosition, imgWidth, imgHeight);
          yPosition += pageHeight; // Move to the next page
          if (yPosition < imgHeight) {
            pdf.addPage();
          }
        }

        pdf.save("download.pdf");
      })
      .catch((error) => {
        console.error("Error capturing image:", error);
      });
  };

  if (loading) {
    return <Loading />;
  }

  if (!candidate || !feedback) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto p-2 flex flex-col gap-8" id="pdf-content">
      {/* Candidate Info */}
      <Card className="">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            Interview Report
            <Button variant={"ghost"} onClick={handleDownloadPDF}>
              <Download />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around flex-col lg:flex-row">
          <p>
            <strong>Name:</strong> {candidate.name}
          </p>
          <p>
            <strong>Email:</strong> {candidate.email}
          </p>
          <p>
            <strong>Position:</strong> {candidate.position}
          </p>
          <p>
            <strong>Status:</strong> {candidate.stage}
          </p>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            Status:{" "}
            <span className="font-semibold">{feedback.finalDecision}</span>
          </div>
          <div>
            Comment:{" "}
            <span className="font-semibold">{feedback.finalComment}</span>
          </div>
        </CardContent>
        <CardContent className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Sr No.</th>
                <th className="border border-gray-300 px-4 py-2">Skill</th>
                <th className="border border-gray-300 px-4 py-2">Rating</th>
                <th className="border border-gray-300 px-4 py-2">
                  Topics Evaluated
                </th>
                <th className="border border-gray-300 px-4 py-2">Comments</th>
              </tr>
            </thead>
            <tbody>
              {feedback.details.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.skill}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.rating}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.topics.join(", ")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.comments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
