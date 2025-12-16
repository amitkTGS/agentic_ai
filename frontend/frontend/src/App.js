import React from "react";

import Upload from "./Upload";

import Dashboard from "./Dashboard";

 

function App() {

  return (

    <div style={styles.container}>

      <header style={styles.header}>

        <h1>Intelligent Expense Audit Dashboard</h1>

        <p>Upload receipts, auto-audit expenses, and review risks</p>

      </header>

 

      <section style={styles.section}>

        <Upload />

      </section>

 

      <hr />

 

      <section style={styles.section}>

        <Dashboard />

      </section>

    </div>

  );

}

 

const styles = {

  container: {

    fontFamily: "Arial, sans-serif",

    padding: "20px",

    maxWidth: "1200px",

    margin: "0 auto"

  },

  header: {

    marginBottom: "20px"

  },

  section: {

    marginTop: "20px"

  }

};

 

export default App;