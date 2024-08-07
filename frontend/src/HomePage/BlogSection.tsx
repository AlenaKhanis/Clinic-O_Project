import { Button, Card, Col, Placeholder, Row } from 'react-bootstrap';

import { useState, useEffect } from 'react';
import { useBackendUrl } from '../BackendUrlContext';

import '../css/BlogSection.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  url: string;
}

/**
 * BlogSection component
 * designed to fetch and display blog posts from an API endpoint
 * 
 */

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const BACKEND_URL = useBackendUrl();

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/news`) 
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        return response.json();
      })
      .then((data: any) => {
        const filteredPosts: BlogPost[] = data.articles
          .filter((article: any) => article.title !== '[Removed]')
          .slice(0, 4)
          .map((article: any, index: number) => ({
            id: index,
            title: article.title,
            content: article.description || article.content || '',
            imageUrl: article.urlToImage || 'https://via.placeholder.com/150',
            url: article.url,
          }));
        setPosts(filteredPosts);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setIsLoading(false);
        setHasError(true);
      });
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...'; // Set the maximum length of the truncated text
    }
    return text;
  };

  return (
    <div className='blog-container'>
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
                  <Placeholder.Button xs={6} />
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          posts.map(post => (
            <Col key={post.id} className="mb-4">
              <Card style={{ width: '18rem', height: '20rem' }}>
                <Card.Img variant="top" src={post.imageUrl} style={{ height: '150px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title className="card-title">{truncateText(post.title, 60)}</Card.Title> 
                  <div className="d-grid card-button">
                    <Button style={{backgroundColor: '#205a66'}} href={post.url} target="_blank">Read More</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
      </div>
  );
};

export default BlogSection;
