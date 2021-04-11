import React from "react"

export default class MenuItems extends React.Component {
  constructor(props) {
    super(props);
    this.abortController = new AbortController();
    this.onNavSelect = this.onNavSelect.bind(this);
  }

  onNavSelect(name) {
    // Call the function that we were passed. This allows us to update App.js's state.
    this.props.onNavSelect(name);
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  render() {
    let menu_items = [];

    if (this.props.items) {
      for (const name of this.props.items) {
        const test_id = `header-${name}`;

        if (this.props.active === name) {
          // If the menu item is active
          menu_items.push(
            <button key={name}
              data-testid={test_id}
              style={styles.menuButton}
              className="uppercase"
              title={name}
              color="#FFFFFF"
              onClick={(e) => { this.onNavSelect(name) }}
            >
              {name}
            </button>
          )
        } else {
          // If the menu item isn't active
          menu_items.push(
            <button key={name}
              data-testid={test_id}
              style={styles.menuButton}
              className="uppercase"
              title={name}
              color="#FFFFFF"
              onClick={(e) => { this.onNavSelect(name) }}
            >
              {name}
            </button>

          )
        }
      }
    }

    return (
      <div style={styles.container}>
        {menu_items}
      </div>
    );
  }
}

const styles = {
  container: {
    position: 'fixed',
    left: '70%', 
    display: 'flex',
    top: "50px",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "transparent",
    color: "white",
    width: "100px",
    height: "30px",
  },
  menuButton: {
    color: "#D36C21",
    backgroundColor: "transparent",
    height: "30px",
    width: "200px",
    left: "738px",
    margin: "11px",
    bottom: "14px",
    border: "none",
    font: "ariel",
    fontSize: "15pt",
  }
};
