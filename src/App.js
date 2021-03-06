import React, { Component } from "react";
import "./App.css";
import { Scrollbars } from "react-custom-scrollbars";
var FontAwesome = require("react-fontawesome");
let recipes;
const emptyRecipe = {
  title: "",
  ingredients: [],
  steps: []
};

if (
  localStorage.getItem("recipes") == null ||
  JSON.parse(localStorage.getItem("recipes")).length == 0
) {
  recipes = [
    {
      title: "Honey Lime Chicken Wings",
      ingredients: [
        "18 whole chicken wings, split",
        "1/4 cup honey",
        "2 tablespoons fresh lime juice",
        "1 tablespoon grated lime zest",
        "1 clove garlic, minced",
        "1/4 teaspoon salt",
        "1/4 teaspoon ground black pepper",
        "1/2 cup all-purpose flour",
        "2 quarts vegetable oil for frying"
      ],
      steps: [
        "In a large bowl, mix together the honey, lime juice, lime peel, garlic, salt and ground black pepper.",
        "Place the flour in a plastic bag and shake the chicken wings in the flour to coat.",
        "In a large skillet, fry the chicken wings in hot, 1 inch deep oil until cooked through. Place the cooked wings in the honey/lime mixture and toss to coat well. Serve immediately."
      ]
    }
  ];
  localStorage.setItem("recipes", JSON.stringify(recipes));
} else {
  recipes = JSON.parse(localStorage.getItem("recipes"));
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRecipeN: 0,
      editing: false
    };
  }

  changeRecipe = (n = 0) => {
    if (this.state.editing) {
    } else {
      this.setState({
        showRecipeN: n
      });
    }
  };

  switchMode = (mode = !this.state.editing) => {
    console.log("asadadsdasda");
    this.setState({
      editing: !this.state.editing
    });
  };

  deleteRecipe = () => {
    recipes.splice(this.state.showRecipeN);
    this.setState({
      showRecipeN: this.state.showRecipeN - 1
    });
    localStorage.setItem("recipes", JSON.stringify(recipes));
  };

  addRecipe = () => {
    if (!this.state.editing) {
      recipes.push(emptyRecipe);
      this.setState(
        {
          showRecipeN: recipes.length - 1
        },
        () => {
          this.switchMode();
        }
      );
    }
  };

  render() {
    return (
      <div className="App">
        <div className="left">
          <IndexBox
            changeRecipe={n => {
              this.changeRecipe(n);
            }}
            showRecipeN={this.state.showRecipeN}
          />
          <Tools
            addRecipe={this.addRecipe}
            deleteRecipe={this.deleteRecipe}
            switchMode={this.switchMode}
          />
        </div>
        {this.state.editing ? (
          <EditBox
            n={this.state.showRecipeN}
            switchMode={this.switchMode}
            deleteRecipe={this.deleteRecipe}
          />
        ) : (
          <RecipeBox n={this.state.showRecipeN} />
        )}
      </div>
    );
  }
}

class IndexBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: ""
    };
  }

  handleChange(event) {
    this.setState({
      filter: event.target.value
    });
  }

  render() {
    let titleList = [];
    for (let i = 0; i < recipes.length; i++) {
      if (
        recipes[i].title.toLowerCase().includes(this.state.filter.toLowerCase())
      )
        titleList.push(
          <IndexEle
            title={recipes[i].title}
            key={i}
            changeRecipe={() => this.props.changeRecipe(i)}
            focus={i == this.props.showRecipeN}
          />
        );
    }
    return (
      <div className="indexBox">
        <input
          className="searchBar"
          type="text"
          placeholder="Filter.."
          onChange={event => this.handleChange(event)}
        />
        <Scrollbars className="index" autohide="true">
          <ul>{titleList}</ul>
        </Scrollbars>
      </div>
    );
  }
}

function IndexEle(props) {
  return (
    <li
      className={props.focus ? "focused" : "unfocused"}
      onClick={() => {
        props.changeRecipe();
      }}
    >
      <p className="indexEle">{props.title}</p>
    </li>
  );
}

let Tools = props => {
  return (
    <div className="tools">
      <button onClick={props.addRecipe}>
        <FontAwesome className="fas fa-plus" style={{ fontSize: "6vh" }} />
      </button>
      <button onClick={props.deleteRecipe}>
        <FontAwesome className="fas fa-trash" style={{ fontSize: "6vh" }} />
      </button>
      <button onClick={props.switchMode}>
        <FontAwesome className="fas fa-pencil" style={{ fontSize: "6vh" }} />
      </button>
    </div>
  );
};

function RecipeBox(props) {
  let n = props.n;
  let ingList = [];
  console.log("recipes:" + n);
  console.log(recipes);
  for (let i = 0; i < recipes[n].ingredients.length; i++) {
    ingList.push(
      <li>
        <p>{recipes[n].ingredients[i]}</p>
      </li>
    );
  }

  let steps = [];
  for (let i = 0; i < recipes[n].steps.length; i++) {
    steps.push(
      <li>
        <p>{recipes[n].steps[i]}</p>
      </li>
    );
  }

  return (
    <div className="recipeBox">
      <div className="recipeHeader">
        <h1 className="recipeName">{recipes[n].title}</h1>
      </div>
      <Scrollbars className="recipe" autohide="true">
        <div className="ingredients">
          <h2>Ingredients</h2>
          <ul className="ingList">{ingList}</ul>
        </div>
        <div className="directions">
          <h2>Directions</h2>
          <ol className="steps">{steps}</ol>
        </div>
      </Scrollbars>
    </div>
  );
}

class EditBox extends Component {
  constructor(props) {
    super(props);
    let n = this.props.n;
    if (recipes[n].title == "") {
      this.state = {
        nameValue: "",
        dirs: [],
        ings: [],
        isNew: true
      };
    } else {
      let ings = recipes[n].ingredients[0];
      let dirs = recipes[n].steps[0];

      for (let i = 1; i < recipes[n].ingredients.length; i++) {
        ings += "\n\n" + recipes[n].ingredients[i];
      }
      for (let i = 1; i < recipes[n].steps.length; i++) {
        dirs += "\n\n" + recipes[n].steps[i];
      }

      this.state = {
        nameValue: recipes[n].title,
        dirs: dirs,
        ings: ings,
        isNew: false
      };
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({
      [name]: value
    });
  }

  handleSave(e) {
    e.preventDefault();
    let n = this.props.n;
    if (
      !(
        this.state.nameValue == "" ||
        this.state.ings == "" ||
        this.state.dirs == ""
      )
    ) {
      let ings = this.state.ings.split("\n\n");
      let dirs = this.state.dirs.split("\n\n");
      recipes[n] = {
        title: this.state.nameValue,
        ingredients: ings,
        steps: dirs
      };
      localStorage.setItem("recipes", JSON.stringify(recipes));
      this.props.switchMode();
    }
  }

  handleRestore(e) {
    e.preventDefault();
    if (this.state.isNew) {
      this.props.deleteRecipe();
      this.props.switchMode();
    } else {
      this.props.switchMode();
    }
  }

  render() {
    let n = this.props.n;

    return (
      <form className="recipeBox">
        <div className="recipeHeader">
          <input
            name="nameValue"
            type="text"
            value={this.state.nameValue}
            onChange={this.handleChange}
            className="recipeName"
          />
        </div>
        <Scrollbars className="recipe" autohide="true">
          <div className="ingredients">
            <h2>Ingredients</h2>
            <textarea
              name="ings"
              value={this.state.ings}
              onChange={this.handleChange}
            />
          </div>
          <div className="directions">
            <h2>Directions</h2>
            <textarea
              name="dirs"
              value={this.state.dirs}
              onChange={this.handleChange}
            />
          </div>
          <button
            onClick={e => {
              this.handleRestore(e);
            }}
          >
            <FontAwesome className="fas fa-undo" style={{ fontSize: "6vh" }} />
          </button>
          <button
            onClick={e => {
              this.handleSave(e);
            }}
          >
            <FontAwesome className="fas fa-save" style={{ fontSize: "6vh" }} />
          </button>
        </Scrollbars>
      </form>
    );
  }
}

export default App;
