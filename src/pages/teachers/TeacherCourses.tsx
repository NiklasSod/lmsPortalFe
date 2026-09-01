import { Fragment } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { courses } from '../../data/courses'

function TeacherCourses() {
  return (
    <Container className="py-4">
      <h1 className="h2">My courses</h1>
      <Row xs={1} md={2} lg={4} className="g-3">
        {courses.map((course, index) => (
          <Fragment key={course.id}>
            <Col>
              <Card
                as={Link}
                to={`/teacher/courses/${course.id}`}
                className="h-100 text-decoration-none text-reset"
              >
                <Card.Img
                  variant="top"
                  src={course.imageUrl}
                  alt=""
                  style={{ height: 160, objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title className="h5">{course.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            {(index + 1) % 3 === 0 && (
              <div className="w-100 d-none d-lg-block" />
            )}
          </Fragment>
        ))}
      </Row>
    </Container>
  )
}

export default TeacherCourses
