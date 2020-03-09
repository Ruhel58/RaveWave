import React, { Component } from "react";
import CategoryInformation from '../CategoryInformation/CategoryInformation'
import {
  ModalBody,
  Badge,
  ListGroupItem,
  Button,
  Modal,
  ModalHeader
  
} from "reactstrap";

/**
 * The component produces a list of results. 
 * 
 * This component uses the props being passed into it to prettify the results
 * and fill each result with addition information. Results are a list of modals. 
 * The modals will hold extra info such as the list of all songs in the category.
 * 
 * Results are a list of Categories, so Category component is used
 */

class Result extends Component {
   
    constructor(props){
        super(props)
        this.state = {
            modal: false
        }
    }

    // results are not a plain list. They are a list of modals
    toggle =()=> {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
      }

    render(){
        const {
            result,
            profile,
            token
        } = this.props

        return (
          <div>
              <ListGroupItem >
                  <h3><Button color="link" onClick={this.toggle}>{result.name + "   "}
                <Badge color="purple" pill>{result.songs.length}</Badge>
                </Button></h3>
                <Modal isOpen={this.state.modal} toggle={this.toggle}> 
                <ModalHeader toggle={this.toggle}>{result.name}</ModalHeader>
                <ModalBody>
                    <CategoryInformation 
                      profile={profile}
                      result={result}
                      token={token}
                    />
                </ModalBody>
                </Modal>
                </ListGroupItem>
          </div>
        )
    }
}

export default Result;