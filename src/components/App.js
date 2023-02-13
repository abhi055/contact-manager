import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import AddContact from "./AddContact";
import ContactList from "./ContactList";
import ContactDetail from "./ContactDetail";
import EditContact from "./EditContact";
import api from "../api/contacts";

function App() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  //retriveContacts

  const retriveContacts = async () => {
    const response = await api.get("/contacts");
    return response.data;
  };

  const addContactHandler = async (contact) => {
    const request = {
      id: uuid(),
      ...contact,
    };
    const response = await api.post("/contacts", request);
    setContacts([...contacts, response.data]);
  };

  const updateContactHandler = async (contact) =>{
    const response = await api.put(`/contacts/${contact.id}`,contact);
    const {id,name,email} = response.data;
    setContacts(contacts.map(contact => {
      return contact.id === id ? {...response.data} : contact
    }));
  };

  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });

    setContacts(newContactList);
  };
  


  const searchHandler = (searchKeyword) => {
    setSearchTerm(searchKeyword);
    if(searchKeyword !== ' '){
    const newContactList = contacts.filter((contact)=>{
      return Object.values(contact).join(' ').toLowerCase().includes(searchKeyword.toLowerCase());
    });
    setSearchResults(newContactList);
  }
  else{
    setSearchResults(ContactList)
  }
  };




  useEffect(() => {
    // localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(contacts))
  }, [contacts]);

  useEffect(() => {
    // const retriveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // if(retriveContacts){
    //   setContacts(retriveContacts);

    const getAllContacts = async () => {
      const allContacts = await retriveContacts();
      if (allContacts) {
        setContacts(allContacts);
      }
    };
    getAllContacts();
  }, []);

  return (
    <div className="ui container">
      <Router>
        <Header />
        <Switch>
          <Route
            path="/"
            exact
            render={(props) => (
              <ContactList
                {...props}
                contacts={searchTerm.length < 1 ? contacts : searchResults}
                getContactId={removeContactHandler}
                searchTerm = {searchTerm}
                searchKeyword = {searchHandler}
              />
            )}
          />
          <Route
            path="/add"
            exact
            render={(props) => (
              <AddContact {...props} addContactHandler={addContactHandler} />
            )}
          />
          <Route
            path="/edit"
            exact
            render={(props) => (
              <EditContact {...props} updateContactHandler={updateContactHandler} />
            )}
          />
          <Route path="/contact/:id" component={ContactDetail} />
        </Switch>

        {/* <AddContact addContactHandler={addContactHandler}/>
      <ContactList contacts={contacts} getContactId={removeContactHandler}/> */}
      </Router>
    </div>
  );
}

export default App;
