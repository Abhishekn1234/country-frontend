import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import CountryCard from "./CountryCard";
import { Container, Row, Col, Form, Button, Spinner, Alert, InputGroup } from "react-bootstrap";
import { FaSearch, FaGlobeAmericas, FaClock } from "react-icons/fa";

const API_URL = "http://localhost:5000/api/countries";

export default function CountryList() {
  const [countries, setCountries] = useState([]);
  const [filters, setFilters] = useState({ search: "", region: "", timezone: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const limit = 12;

  const fetchCountries = async () => {
    setLoading(true);
    setError("");
    try {
      let resData = [];
      if (filters.timezone) {
        const res = await axios.get(`${API_URL}/search`, { params: { timezone: encodeURIComponent(filters.timezone) } });
        resData = res.data;
      } else if (filters.region && !filters.search) {
        const res = await axios.get(`${API_URL}/region/${filters.region}`);
        resData = res.data;
      } else if (filters.search) {
        const res = await axios.get(`${API_URL}/search`, { params: { name: filters.search, capital: filters.search } });
        resData = res.data;
      } else {
        const res = await axios.get(API_URL, { params: { page, limit } });
        resData = res.data;
      }

      setCountries(prev => {
        const all = page === 1 ? resData : [...prev, ...resData];
        return Array.from(new Map(all.map(c => [c.code, c])).values());
      });

      setHasMore(resData.length >= limit);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setCountries([]); setPage(1); setHasMore(true); }, [filters]);
  useEffect(() => { fetchCountries(); }, [page, filters]);

  const lastCountryRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) setPage(prev => prev + 1);
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => setFilters({ search: "", region: "", timezone: "" });

  return (
    <Container className="py-4">
      <div className="bg-white p-3 p-md-4 rounded-3 shadow-sm mb-4">
        <Form onSubmit={e => e.preventDefault()}>
          <Row className="g-2 g-md-3 align-items-center">
            <Col xs={12} md={5}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0"><FaSearch className="text-muted" /></InputGroup.Text>
                <Form.Control name="search" placeholder="Search by name or capital" value={filters.search} onChange={handleFilterChange} className="border-start-0" />
              </InputGroup>
            </Col>
            <Col xs={12} md={3}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0"><FaGlobeAmericas className="text-muted" /></InputGroup.Text>
                <Form.Select name="region" value={filters.region} onChange={handleFilterChange} className="border-start-0">
                  <option value="">All Regions</option>
                  <option value="Africa">Africa</option>
                  <option value="Asia">Asia</option>
                  <option value="Europe">Europe</option>
                  <option value="Americas">Americas</option>
                  <option value="Oceania">Oceania</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col xs={12} md={3}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0"><FaClock className="text-muted" /></InputGroup.Text>
                <Form.Control name="timezone" placeholder="UTC±00:00" value={filters.timezone} onChange={handleFilterChange} className="border-start-0" />
              </InputGroup>
            </Col>
            <Col xs={12} md={1}>
              <Button variant="outline-secondary" onClick={handleResetFilters} className="w-100 mt-2 mt-md-0" disabled={!filters.search && !filters.region && !filters.timezone}>Reset</Button>
            </Col>
          </Row>
        </Form>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {countries.length === 0 && !loading && (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm">
          <h5 className="text-muted">No countries found</h5>
          <p className="text-muted">Try adjusting your search or filters</p>
        </div>
      )}

      <Row className="g-3">
        {countries.map((country, index) => {
          const isLast = countries.length === index + 1;
          return (
            <Col key={country.code} xs={12} sm={6} md={4} lg={3} className="d-flex" {...(isLast ? { ref: lastCountryRef } : {})}>
              <div className="w-100" style={{ minWidth: "180px", maxWidth: "260px" }}>
                <CountryCard country={country} />
              </div>
            </Col>
          );
        })}
      </Row>

      <div className="text-center my-4">
        {loading ? <Spinner animation="border" /> : !hasMore && countries.length > 0 && <div className="text-muted py-3">You've reached the end of results</div>}
      </div>
    </Container>
  );
}
