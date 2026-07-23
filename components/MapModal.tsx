import React from "react";
import { Modal } from "antd";
import Map from "./Map";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      title="Location"
      visible={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Map />
    </Modal>
  );
};

export default MapModal;
