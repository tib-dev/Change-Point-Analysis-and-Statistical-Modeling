const EventDetailModal = ({
  event,
  onClose,
}: {
  event: any;
  onClose: () => void;
}) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ background: "white", padding: 24, width: 400 }}>
        <h3>{event.title}</h3>
        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <p>
          <strong>Description:</strong> {event.description}
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EventDetailModal;
