import { useState } from "react";
import { Alert, Button, Card, Form, ListGroup, Spinner } from "react-bootstrap";

export default function Potions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [potions, setPotions] = useState([]);
  const [selectedPotion, setSelectedPotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  function clearSearch() {
    setSearchTerm("");
    setPotions([]);
    setSelectedPotion(null);
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
    setPotions([]);
    setSelectedPotion(null);
    setHasSearched(false);

    try {
      // Encode Potter DB's bracketed filter parameters for the request URL.
      const params = new URLSearchParams({
        "filter[name_cont]": name,
        "page[size]": "10",
      });
      const response = await fetch(
        `https://api.potterdb.com/v1/potions?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      setPotions(result.data);
      setHasSearched(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load potions.",
      );
    } finally {
      setLoading(false);
    }
  }

  // The selected search result already contains the attributes shown below.
  const attributes = selectedPotion?.attributes;

  return (
    <main className="container py-4">
      <h2>Potions</h2>
      <Form onSubmit={handleSearch} className="mb-4">
        <Form.Group className="mb-3" controlId="potion-search">
          <Form.Label>Search by potion name</Form.Label>
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="e.g. Polyjuice"
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
            "Search potions"
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
      {hasSearched && potions.length === 0 && (
        <Alert variant="info">
          No potions found matching “{searchTerm.trim()}”.
        </Alert>
      )}

      {potions.length > 0 && (
        <section aria-labelledby="potion-results-heading">
          <h2 id="potion-results-heading" className="h4">
            Search results
          </h2>
          <ListGroup>
            {potions.map((potion) => (
              <ListGroup.Item
                action
                active={selectedPotion?.id === potion.id}
                key={potion.id}
                onClick={() => setSelectedPotion(potion)}
              >
                {potion.attributes.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </section>
      )}

      {attributes && (
        <Card className="mt-4">
          {attributes.image && (
            <Card.Img
              variant="top"
              src={attributes.image}
              alt={`Image of ${attributes.name}`}
              style={{ maxHeight: "24rem", objectFit: "contain" }}
            />
          )}
          <Card.Body>
            <Card.Title>{attributes.name}</Card.Title>
            <dl className="mb-0">
              <dt>Effect</dt>
              <dd>{attributes.effect || "Not listed"}</dd>
              <dt>Characteristics</dt>
              <dd>{attributes.characteristics || "Not listed"}</dd>
              <dt>Difficulty</dt>
              <dd>{attributes.difficulty || "Not listed"}</dd>
              <dt>Time to brew</dt>
              <dd>{attributes.time || "Not listed"}</dd>
              <dt>Ingredients</dt>
              <dd>{attributes.ingredients || "Not listed"}</dd>
              <dt>Side effects</dt>
              <dd>{attributes.side_effects || "Not listed"}</dd>
              <dt>Inventors</dt>
              <dd>{attributes.inventors || "Not listed"}</dd>
            </dl>
            {attributes.wiki && (
              <Card.Link
                href={attributes.wiki}
                target="_blank"
                rel="noreferrer"
              >
                Learn more
              </Card.Link>
            )}
          </Card.Body>
        </Card>
      )}
    </main>
  );
}
