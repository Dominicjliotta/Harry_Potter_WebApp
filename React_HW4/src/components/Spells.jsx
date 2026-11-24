import { useState } from "react";
import { Alert, Button, Card, Form, ListGroup, Spinner } from "react-bootstrap";

function Spells() {
  // UseState constants
  const [searchTerm, setSearchTerm] = useState("");
  const [spells, setSpells] = useState([]);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  // Handle the clear button
  function clearSearch() {
    setSearchTerm("");
    setSpells([]);
    setSelectedSpell(null);
    setHasSearched(false);
    setError("");
  }

  async function handleSearch(event) {
    event.preventDefault();

    const name = searchTerm.trim();
    if (!name) {
      return;
    }

    setLoading(true);
    setError("");
    setSpells([]);
    setSelectedSpell(null);
    setHasSearched(false);

    try {
      // Encode Potter DB's bracketed filter parameters for the request URL.
      const params = new URLSearchParams({
        "filter[name_cont]": name,
        "page[size]": "10",
      });
      const response = await fetch(
        `https://api.potterdb.com/v1/spells?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      setSpells(result.data);
      setHasSearched(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load spells.",
      );
    } finally {
      setLoading(false);
    }
  }

  // The selected search result already contains the attributes shown below.
  const attributes = selectedSpell?.attributes;

  return (
    <main className="container py-4">
      <h2>Spells</h2>
      <Form onSubmit={handleSearch} className="mb-4">
        <Form.Group className="mb-3" controlId="spell-search">
          <Form.Label>Search by spell name</Form.Label>
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="e.g. Patronus"
            required
          />
        </Form.Group>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" aria-hidden="true" />
              Searching...
            </>
          ) : (
            "Search spells"
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="ms-2"
          onClick={clearSearch}
          disabled={loading}
        >
          Clear
        </Button>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}
      {hasSearched && spells.length === 0 && (
        <Alert variant="info">
          No spells found matching “{searchTerm.trim()}”.
        </Alert>
      )}

      {selectedSpell && attributes && (
        <Card className="mb-4">
          {attributes.image && (
            <Card.Img
              variant="top"
              src={attributes.image}
              alt={`Illustration of ${attributes.name}`}
              style={{ maxHeight: "24rem", objectFit: "contain" }}
            />
          )}
          <Card.Body>
            <Card.Title>{attributes.name}</Card.Title>
            <dl className="mb-0">
              <dt>Name</dt>
              <dd>{attributes.name || "Not listed"}</dd>
              <dt>Incantation</dt>
              <dd>{attributes.incantation || "Not listed"}</dd>
              <dt>Category</dt>
              <dd>{attributes.category || "Not listed"}</dd>
              <dt>Effect</dt>
              <dd>{attributes.effect || "Not listed"}</dd>
              <dt>Light</dt>
              <dd>{attributes.light || "Not listed"}</dd>
              <dt>Hand movement</dt>
              <dd>{attributes.hand || "Not listed"}</dd>
              <dt>Creator</dt>
              <dd>{attributes.creator || "Not listed"}</dd>
            </dl>
          </Card.Body>
        </Card>
      )}

      {spells.length > 0 && (
        <section aria-labelledby="spell-results-heading">
          <h2 id="spell-results-heading" className="h4">
            Search results
          </h2>
          <ListGroup>
            {spells.map((spell) => (
              <ListGroup.Item
                as="button"
                action
                active={selectedSpell?.id === spell.id}
                key={spell.id}
                type="button"
                onClick={() => setSelectedSpell(spell)}
              >
                {spell.attributes.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </section>
      )}
    </main>
  );
}

export default Spells;
