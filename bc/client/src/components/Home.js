import React from 'react';
import { Form, Button, Modal, ProgressBar, InputGroup, FormControl, Image, Table, DropdownButton, Dropdown } from 'react-bootstrap';

import { AuthContext } from '../auth/AuthContext'
import bg1 from '../images/josh-nuttall-eTrHMJwI5ro-unsplash.jpg'
import bg2 from '../images/josh-nuttall-XVTWFHcNIko-unsplash.jpg'
import API from '../api/Api';
import { Link } from 'react-router-dom';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            bicycles: [],
            result: [],
            submitting: true,
            searched: false,
            show: false,
            type: 'Bike shop'
        };
    }

    async componentDidMount() {
        let bicycles = await API.getBicycles();
        this.setState({ bicycles, submitting: false })
    }

    handleClose() {
        this.setState({ show: false })
    }

    handleSearch() {
        const map = {
            "Bike shop": "store",
            "Bike": "name",
            // "Price": "price",
            "Location City": "addr",
        }

        let bicycles = this.state.bicycles.filter((bicycle) => bicycle[map[this.state.type]].includes(this.state.search))
        this.setState({ result: bicycles, searched: true })
    }

    render() {
        return <AuthContext.Consumer>
            {(context) => (<>
                {
                    this.state.submitting ? <ProgressBar variant="dark" animated now={100} /> : ''
                }
                <Form style={{ textAlign: 'center' }} className="mt-5" onSubmit={this.placeOrder}>
                    <Form.Group >
                        <InputGroup size="lg" style={{ width: '60vw', margin: '0px auto' }} className="mb-3">
                            <DropdownButton
                                as={InputGroup.Prepend}
                                variant="outline-light"
                                title={this.state.type}
                                id="input-group-dropdown"
                            >
                                <Dropdown.Item onClick={(e) => { e.preventDefault(); this.setState({ type: "Bike shop" }) }}>Bike shop</Dropdown.Item>
                                <Dropdown.Item onClick={(e) => { e.preventDefault(); this.setState({ type: "Bike" }) }}>Bike</Dropdown.Item>
                                {/* <Dropdown.Item onClick={(e) => { e.preventDefault(); this.setState({ type: "Price" }) }}>Price</Dropdown.Item> */}
                                <Dropdown.Item onClick={(e) => { e.preventDefault(); this.setState({ type: "Location City" }) }}>Location City</Dropdown.Item>
                            </DropdownButton>
                            <FormControl
                                placeholder="Search"
                                value={this.state.search}
                                onChange={(e) => this.setState({ search: e.target.value })}
                            />
                            <InputGroup.Append>
                                <Button onClick={() => this.handleSearch()} variant="outline-light">Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>

                    {!this.state.searched && <div className="position-relative">
                        <div className="position-absolute" style={{ width: '100vw', margin: '0 auto', color: 'white', top: '30%' }} >
                            <h3>Look at a bike shop near you</h3>
                        </div>
                        <Image src={bg1} fluid />
                    </div>}

                </Form>

                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Bike shop</th>
                            <th>Bike</th>
                            <th>Price</th>
                            <th>Location City</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !this.state.searched ?
                                this.state.bicycles.map((b, index) => {
                                    return <tr key={b.name}>
                                        <td>{index + 1}</td>
                                        <td>{b.store}</td>
                                        <td>{b.name}</td>
                                        <td>${b.price}</td>
                                        <td>{b.addr}</td>
                                        <td><a target="_blank" className="btn btn-outline-light" href={b.link}>Link</a></td>
                                    </tr>
                                }) : this.state.result.map((b, index) => {
                                    return <tr key={b.name}>
                                        <td>{index + 1}</td>
                                        <td>{b.store}</td>
                                        <td>{b.name}</td>
                                        <td>${b.price}</td>
                                        <td>{b.addr}</td>
                                        <td><a target="_blank" className="btn btn-outline-light" href={b.link}>Link</a></td>
                                    </tr>
                                })}
                    </tbody>
                </Table>
                {this.state.searched && this.state.result.length === 0 && <h3 className="text-center" style={{ color: 'white' }}>No data</h3>}
                <div className="position-relative">
                    <div className="position-absolute" style={{ right: '10px', top: '40%', color: 'white', width: '20vw' }} >
                        <h3> Find your favorite bike here</h3>

                        <Link to="/map"><Button variant="outline-light">Find More</Button></Link>
                    </div>
                    <Image src={bg2} fluid />
                </div>
                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        You order has been processed! Thank you!!
                     </Modal.Body>

                </Modal>
            </>)}
        </AuthContext.Consumer>
    }

}

export default Home