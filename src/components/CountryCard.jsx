import React, { useState, useEffect } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function CountryCard({ country }) {
  const [localTime, setLocalTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (country.timezones?.length) {
      const match = country.timezones[0].match(/UTC([+-]\d{2}):?(\d{2})?/);
      const offsetHours = parseInt(match?.[1] ?? 0, 10);
      const offsetMinutes = parseInt(match?.[2] ?? 0, 10);
      const nowUTC = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000);
      const local = new Date(nowUTC.getTime() + (offsetHours * 60 + offsetMinutes) * 60000);
      setLocalTime(
        local.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
      );
    }
  }, [country]);

  return (
    <Card
      className="country-card h-100 shadow-sm border-0 d-flex flex-column"
      style={{ borderRadius: "12px", transition: "transform 0.2s, box-shadow 0.2s", overflow: "hidden" }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = ""}
    >
      <div
        className="position-relative w-100"
        style={{ paddingTop: "60%", overflow: "hidden", backgroundColor: "#f8f9fa" }}
      >
        <Card.Img
          variant="top"
          src={country.flag}
          alt={`${country.name} flag`}
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        />
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="mb-3">
          <Card.Title className="fw-bold mb-2 text-truncate" style={{ fontSize: "1rem" }}>
            {country.name}
          </Card.Title>

          <div className="d-flex flex-wrap align-items-center mb-2 gap-2">
            <Badge bg="light" text="dark" className="fw-normal" style={{ fontSize: "0.75rem" }}>
              {country.region || "N/A"}
            </Badge>

            {country.timezones?.length > 0 && (
              <Badge bg="info" className="fw-normal" style={{ fontSize: "0.75rem" }}>
                {country.timezones[0]}
              </Badge>
            )}
          </div>

          <div className="d-flex align-items-center flex-wrap gap-1">
            <i className="bi bi-clock me-1 text-muted"></i>
            <small className="text-muted" style={{ fontSize: "0.8rem" }}>
              Local time: <span className="fw-semibold">{localTime || "N/A"}</span>
            </small>
          </div>
        </div>

        <Button
          variant="outline-primary"
          className="mt-auto align-self-start w-100 w-md-auto"
          onClick={() => navigate(`/country/${country.code}`)}
          style={{
            borderRadius: "20px",
            padding: "0.375rem 1rem",
            fontSize: "0.875rem",
            borderWidth: "2px",
            fontWeight: "500",
          }}
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}

