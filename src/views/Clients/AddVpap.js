import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { postWihoutMediaData } from '../../lib/request';
import sweetAlert from 'sweetalert2';

const VpapForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState({
    jobId: id,
    sections: [
      {
        title: 'Section A',
        description: 'Consignment Packaging for airfreight perishable must be verified for compliance with one or more of the following secure packaging options.',
        options: [
          { label: 'Integral Cartons: Goods must be packed in fully enclosed cartons that have no ventilation holes, and with lids tightly fixed.', checked: false },
          { label: 'Ventilation holes of cartons covered: Ventilation holes must be covered/sealed with mesh/screen of no more than 1.6mm diameter pore size and not less than 0.16mm strand thickness. Alternatively, ventilation holes may be taped over.', checked: false },
          { label: 'Polythene Liner: Vented carton with polythene liners/bags must be sealed. Overlapping folder edges of polythene liner is considered sealed.', checked: false },
          { label: 'Mesh or Plastic (Shrink) wrapped pallets or ULD’s: ULD’s transporting cartons with ventilation holes/gaps, or palletized cartons with ventilation holes/gaps must be fully covered or wrapped with polythene/plastic/foil sheet or mesh/screen of no more than 1.6mm diameter pore size and not less than 0.16mm strand thickness.', checked: false },
          { label: 'Carton packed in an enclosed container: C, AAP, AMF, AAF, ALF, AKE, AKH', checked: false },
          { label: 'NOT APPLICABLE', checked: false }
        ],
        damage: { yes: false, no: false }
      },
      {
        title: 'Section B',
        description: 'Airfreight perishable verified as without secure packaging must be immediately secured with one or more of the following secure packaging options',
        options: [
          { label: 'Placed in an enclosed container: i.e. AMP, AAP, AMF, AAF, ALF, AKE, AKH', checked: false },
          { label: 'Ventilation holes of cartons covered: Ventilation holes must be covered/sealed with mesh/screen of no more than 1.6mm diameter pore size and not less than 0.16mm strand thickness. Alternatively, ventilation holes may be taped over.', checked: false },
          { label: 'Mesh or Plastic (Shrink) wrapped pallets or ULD’s: ULD’s transporting cartons with ventilation holes/gaps, or palletized cartons with ventilation holes/gaps must be fully covered or wrapped with polythene/plastic/foil sheet or mesh/screen of no more than 1.6mm diameter pore size and not less than 0.16mm strand thickness. ', checked: false },
          { label: 'NOT APPLICABLE', checked: false }
        ],
        damage: { yes: false, no: false }
      }
    ]
  });

  const [errors, setErrors] = useState({
    jobId: '',
    sections: []
  });

  const handleOptionChange = (sectionIndex, optionIndex, e) => {
    const updatedSections = job.sections.map((section, i) =>
      i === sectionIndex ? { ...section, options: section.options.map((option, j) => j === optionIndex ? { ...option, checked: e.target.checked } : option) } : section
    );
    setJob({ ...job, sections: updatedSections });
  };

  const handleDamageChange = (sectionIndex, value) => {
    const updatedSections = job.sections.map((section, i) =>
      i === sectionIndex ? { ...section, damage: { yes: value === 'yes', no: value === 'no' } } : section
    );
    setJob({ ...job, sections: updatedSections });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = { jobId: '', sections: [] };
    let hasErrors = false;

    if (!job.jobId) {
      newErrors.jobId = 'Job ID is required';
      hasErrors = true;
    }
    // handle damage check
    job.sections.forEach((section, sectionIndex) => {
      if (!section.damage.yes && !section.damage.no) {
        newErrors.sections[sectionIndex] = 'Please select damage option';
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    postWihoutMediaData(`/admin/job/VPAP`, job, 'admin')
      .then((response) => {
        if (response.data.status) {
          setLoading(false);
          sweetAlert.fire({
            title: 'Success',
            text: 'VPAP added successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate(`/client/job/details/${id}`);
          });
        } else {
          sweetAlert.fire({
            title: 'Error',
            text: response.data.message || 'Something went wrong',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
  };


  return (
    <Container className='mt-2'>
      <h4>VPAP Form</h4>
      <Form onSubmit={handleSubmit}>
        {job.sections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="mb-3">
            <Card.Body>
              <div className='text-center text-info fw-bold m-3'>
                {section.title}
              </div>
              <hr />
              <p>{section.description}</p>
              {section.options.map((option, optionIndex) => (
                <Form.Check
                  key={optionIndex}
                  type="checkbox"
                  label={option.label}
                  checked={option.checked}
                  className='ml-3 m-2 mt-4 fw-bold'
                  style={{ fontSize: '13px' }}
                  onChange={(e) => handleOptionChange(sectionIndex, optionIndex, e)}
                />
              ))}
              <Form.Group as={Row} controlId={`damage-${sectionIndex}`} className="mt-3">
                <Row>
                  <Col sm={2} md={2} className='ml-3 m-2 fw-bold'
                    style={{ fontSize: '13px' }}>Damage
                  </Col>
                  <Col sm={10} md={10} >
                    <Form.Check
                      type="radio"
                      label="Yes"
                      name={`damage-${sectionIndex}`}
                      style={{ fontSize: '13px' }}
                      checked={section.damage.yes}
                      onChange={() => handleDamageChange(sectionIndex, 'yes')}
                    />
                    <Form.Check
                      type="radio"
                      label="No"
                      name={`damage-${sectionIndex}`}
                      style={{ fontSize: '13px' }}
                      checked={section.damage.no}
                      onChange={() => handleDamageChange(sectionIndex, 'no')}
                    />
                    {
                      errors.sections[sectionIndex] && <div className='text-danger'>{errors.sections[sectionIndex]}</div>
                    }
                  </Col>
                </Row>
              </Form.Group>
            </Card.Body>
          </Card>
        ))}
        <Button type='submit' className='m-1' disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Save VPAP'}
        </Button>
      </Form>
    </Container>
  );
};

export default VpapForm;
