import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Spinner, Button, Card, Badge, Stack ,Alert} from "react-bootstrap";
import { FaArrowLeft, FaGlobe, FaMapMarkerAlt, FaUsers, FaRuler, FaClock, FaLanguage, FaMoneyBillWave } from "react-icons/fa";

const API_URL = "http://localhost:5000/api/countries";

export default function CountryDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${API_URL}/${code}`);
        setCountry(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load country details");
        setCountry(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCountry();
  }, [code]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4 text-center">
        <Alert variant="danger">{error}</Alert>
        <Button variant="outline-primary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" />
          Back to Countries
        </Button>
      </Container>
    );
  }

  if (!country) {
    return (
      <Container className="mt-4 text-center">
        <Alert variant="warning">Country not found</Alert>
        <Button variant="outline-primary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" />
          Back to Countries
        </Button>
      </Container>
    );
  }

  const DetailItem = ({ icon, title, value }) => (
    <div className="border-bottom pb-3 mb-3">
      <div className="d-flex align-items-center mb-1">
        <span className="text-primary me-2">{icon}</span>
        <h6 className="text-muted mb-0">{title}</h6>
      </div>
      <p className="mb-0 fw-semibold">{value || "N/A"}</p>
    </div>
  );

  return (
    <Container className="py-4">
      <Button 
        variant="outline-primary" 
        onClick={() => navigate(-1)}
        className="mb-4 shadow-sm d-flex align-items-center"
      >
        <FaArrowLeft className="me-2" />
        Back to Countries
      </Button>

      <Card className="shadow-sm rounded overflow-hidden">
        <Card.Body className="p-0">
          <Row className="g-0">
            {/* Flag Column - Full width on mobile, half on larger screens */}
            <Col lg={6} className="p-4 bg-light">
              <div className="d-flex justify-content-center align-items-center h-100">
                <img
                  src={country.flag}
                  alt={`Flag of ${country.name}`}
                  className="img-fluid rounded shadow"
                  style={{ 
                    maxHeight: "350px",
                    width: "auto",
                    objectFit: "contain"
                  }}
                />
              </div>
            </Col>

            {/* Details Column - Full width on mobile, half on larger screens */}
            <Col lg={6} className="p-4">
              <div className="px-lg-3">
                <h2 className="mb-3 fw-bold">{country.name}</h2>
                
                <Stack direction="horizontal" gap={2} className="mb-4 flex-wrap">
                  {country.region && (
                    <Badge pill bg="info" className="d-flex align-items-center">
                      <FaGlobe className="me-1" />
                      {country.region}
                    </Badge>
                  )}
                  {country.subregion && (
                    <Badge pill bg="secondary" className="d-flex align-items-center">
                      <FaMapMarkerAlt className="me-1" />
                      {country.subregion}
                    </Badge>
                  )}
                </Stack>

                <Row className="g-3">
                  <Col xs={12} sm={6}>
                    <DetailItem 
                      icon={<FaMapMarkerAlt />} 
                      title="Capital" 
                      value={country.capital} 
                    />
                  </Col>

                  <Col xs={12} sm={6}>
                    <DetailItem 
                      icon={<FaUsers />} 
                      title="Population" 
                      value={country.population?.toLocaleString()} 
                    />
                  </Col>

                  <Col xs={12} sm={6}>
                    <DetailItem 
                      icon={<FaRuler />} 
                      title="Area" 
                      value={country.area ? `${country.area.toLocaleString()} km²` : null} 
                    />
                  </Col>

                  <Col xs={12} sm={6}>
                    <DetailItem 
                      icon={<FaClock />} 
                      title="Timezones" 
                      value={country.timezones?.slice(0, 2).join(", ")} 
                    />
                  </Col>

                  <Col xs={12}>
                    <DetailItem 
                      icon={<FaLanguage />} 
                      title="Languages" 
                      value={country.languages ? Object.values(country.languages).slice(0, 3).join(", ") : null} 
                    />
                  </Col>

                  <Col xs={12}>
                    <DetailItem 
                      icon={<FaMoneyBillWave />} 
                      title="Currencies" 
                      value={country.currencies ? Object.values(country.currencies).map(c => c.name).slice(0, 2).join(", ") : null} 
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}