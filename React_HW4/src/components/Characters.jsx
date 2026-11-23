import { useState } from "react";
import { Alert, Button, Card, Form, ListGroup, Spinner } from "react-bootstrap";

export default function Characters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  function clearSearch() {
    setSearchTerm("");
    setCharacters([]);
    setSelectedCharacter(null);
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
    setCharacters([]);
    setSelectedCharacter(null);
    setHasSearched(false);

    try {
      // Encode Potter DB's bracketed filter parameters for the request URL.
      const params = new URLSearchParams({
        "filter[name_cont]": name,
        "page[size]": "10",
      });
      const response = await fetch(
        `https://api.potterdb.com/v1/characters?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      setCharacters(result.data);
      setHasSearched(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load characters.",
      );
    } finally {
      setLoading(false);
    }
  }

  // The selected search result already contains the attributes shown below.
  const attributes = selectedCharacter?.attributes;

  return (
    <main className="container py-4">
      <h2>Characters</h2>
      <Form onSubmit={handleSearch} className="mb-4">
        <Form.Group className="mb-3" controlId="character-search">
          <Form.Label>Search by character name</Form.Label>
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="e.g. Hermione"
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
            "Search characters"
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
      {hasSearched && characters.length === 0 && (
        <Alert variant="info">
          No characters found matching “{searchTerm.trim()}”.
        </Alert>
      )}

      {characters.length > 0 && (
        <section aria-labelledby="character-results-heading">
          <h2 id="character-results-heading" className="h4">
            Search results
          </h2>
          <ListGroup>
            {characters.map((character) => (
              <ListGroup.Item
                action
                active={selectedCharacter?.id === character.id}
                key={character.id}
                onClick={() => setSelectedCharacter(character)}
              >
                {character.attributes.name}
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
              alt={`Portrait of ${attributes.name}`}
              style={{ maxHeight: "24rem", objectFit: "contain" }}
            />
          )}
          <Card.Body>
            <Card.Title>{attributes.name}</Card.Title>
            <dl className="mb-0">
              <dt>House</dt>
              <dd>{attributes.house || "Not listed"}</dd>
              <dt>Species</dt>
              <dd>{attributes.species || "Not listed"}</dd>
              <dt>Gender</dt>
              <dd>{attributes.gender || "Not listed"}</dd>
              <dt>Blood status</dt>
              <dd>{attributes.blood_status || "Not listed"}</dd>
              <dt>Patronus</dt>
              <dd>{attributes.patronus || "Not listed"}</dd>
            </dl>
          </Card.Body>
        </Card>
      )}
    </main>
  );
}
