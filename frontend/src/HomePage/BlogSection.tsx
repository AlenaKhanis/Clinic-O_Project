import { Button, Card, Col, Container, Placeholder, Row } from 'react-bootstrap';
import '../css/BlogSection.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

type BlogPost = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  url: string;
};

//TODO: hide api in back end

function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetch('https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=714e1b2241d04060a77d54fca596b8b7')
      .then(response => response.json())
      .then((data) => {
        const filteredArticles = data.articles.filter((article: any) => article.title !== '[Removed]');
        setTimeout(() => {
          setPosts(
            filteredArticles.slice(0, 4).map((article: any, index: number) => ({
              id: index,
              title: article.title,
              content: article.description || article.content,
              imageUrl: article.urlToImage || 'https://via.placeholder.com/150',
              url: article.url,
            }))
          );
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setIsLoading(false); 
        setHasError(true);
      });
  }, []);

  return (
    <Container className='blog-container'>
      <Row xs={1} md={2} lg={4} className="g-4">
        {isLoading || hasError ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Col key={index} className="mb-4">
              <Card style={{ width: '18rem', height: '24rem' }}>
                <Card.Img variant="top" src="https://via.placeholder.com/150" style={{ height: '150px', objectFit: 'cover' }} />
                <Card.Body>
                  <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                    <Placeholder xs={6} /> <Placeholder xs={8} />
                  </Placeholder>
                  <Placeholder.Button variant="primary" xs={6} />
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          posts.map((post) => (
            <Col key={post.id} className="mb-4">
              <Card style={{ width: '18rem', height: '24rem' }}>
                <Card.Img variant="top" src={post.imageUrl} style={{ height: '150px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <div className="d-grid card-button">
                    <Button variant="primary" href={post.url} target="_blank">Read More</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default BlogSection;
