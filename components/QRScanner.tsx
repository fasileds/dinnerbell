import React, { useRef, useState, useEffect } from "react";
import { BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";

interface QRScannerProps {
  onScan: (data: string) => void;
  onError: (error: any) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    const constraints = {
      video: {
        facingMode: "environment", // Use the back camera for scanning
      },
    };

    // Start scanning when component mounts
    const startScanning = async () => {
      if (videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          videoRef.current.srcObject = stream;

          // Start scanning QR codes
          codeReader.decodeFromVideoDevice(
            null, // Pass null to use the default video device
            videoRef.current,
            (result, error) => {
              if (result) {
                setIsScanning(false);
                onScan(result.getText()); // Trigger onScan prop when QR code is detected
              } else if (error) {
                setIsScanning(false);
                onError(error); // Trigger onError prop if an error occurs
              }
            }
          );
          setIsScanning(true);
        } catch (err) {
          setIsScanning(false);
          console.error("Error starting QR scanner: ", err);
          onError(err); // Trigger onError if there's an issue with accessing media devices
        }
      }
    };

    startScanning();

    // Cleanup on unmount
    return () => {
      codeReader.reset();
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onScan, onError]); // Re-run effect if onScan or onError changes

  return (
    <div>
      <h2>Scan QR Code</h2>
      <video ref={videoRef} style={{ width: "100%", height: "auto" }} />
      {isScanning ? <p>Scanning...</p> : <p>No QR code detected yet.</p>}
    </div>
  );
};

export default QRScanner;
