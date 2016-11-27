import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'

var db = $.idb({
    name:'olx',
    version: 1,
    drop: [],
    stores: [{
        name: "users",
        keyPath: ["user", "password"],
        autoIncrement: false
    }]
});

var MainLayout = React.createClass({
    render: function() {
        return (
            <div className="container">
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="/">
                                <img width="25px" height="25px" alt="OLX Layout App" src="public/logo.png" />
                            </a>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <NavLink to="/">Home</NavLink>
                                <NavLink to="login" dataWhen="logout">Login</NavLink>
                                <NavLink to="register" dataWhen="logout">Sign Up</NavLink>
                                <NavLink to="products" dataWhen="login">Products</NavLink>
                            </ul>
                            <ul className="nav navbar-nav pull-right">
                                <LogoutLink>Logout</LogoutLink>
                            </ul>
                        </div>
                    </div>
                </nav>
                <main>
                    {this.props.children}
                </main>
                <footer className="footer">
                    <ul className="nav navbar-nav">
                        <li><a>Footer 1</a></li>
                        <li><a>Footer 2</a></li>
                        <li><a>Footer 3</a></li>
                    </ul>
                    <ul className="nav navbar-nav hidden-xs pull-right">
                        <li><a>Copyright</a></li>
                    </ul>
                    <ul className="nav navbar-nav visible-xs-block">
                        <li><a>Copyright</a></li>
                    </ul>
                </footer>
            </div>
        )
    }
})

var NavLink = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    render: function() {
        let isActive = this.context.router.isActive(this.props.to, true),
            isLoggedIn = localStorage.getItem('currentUser') && localStorage.getItem('currentUser') !== "" ? true : false,
            active = isActive ? "active" : "",
            hidden = "";

        switch(this.props.dataWhen) {
            case 'login':
                hidden = isLoggedIn ? "" : "hidden";
                break;
            case 'logout':
                hidden = isLoggedIn ? "hidden" :  "";
                break;
            default:
                hidden = "";
                break;
        }

        return (
            <li className={active + " " + hidden}>
                <Link to={this.props.to}>
                    {this.props.children}
                </Link>
            </li>
        );
    }
});

var LogoutLink = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    onClick() {
        var r = confirm("Are you sure you want to logout?");
        if (r === true) {
            localStorage.setItem('currentUser', "");
            hashHistory.push("/");
        }
        return;
    },
    render: function() {
      let isLoggedIn = localStorage.getItem('currentUser') && localStorage.getItem('currentUser') !== "" ? true : false,
        hidden = isLoggedIn ? "" : "hidden";

      return (
          <li>
              <a href="#" className={hidden} onClick={this.onClick}>
                  {this.props.children}
              </a>
          </li>
      );
    }
});

var HomePage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    render: function() {
        return (
            <div id="home" className="container text-center">
                <h1>This is a test project to OLX company.</h1>
            </div>
        );
    }
});

var ProductsLayout = React.createClass({
    getInitialState: function() {
        return {
            data: getDemoData(),
            loading: false
        };
    },
    render: function() {
        var pages = Math.ceil(this.state.data.length / 2);
        var boxes = [];

        for(let i = 0; i < pages; i++) {
            boxes.push(
                <div key={i} className="col-md-4">
                    <div className="row">
                        <ProductLayout
                            image={ this.state.data[i].image }
                            name={ this.state.data[i].name }
                            mkid={ this.state.data[i].mkid }
                        />
                        <ProductLayout
                            image={ this.state.data[i+1].image }
                            name={ this.state.data[i+1].name }
                            mkid={ this.state.data[i+1].mkid }
                        />
                    </div>
                </div>
            )
        }

        return (
            <div className="products-layout">
                <div className="container-fluid">
                    <div className="results-layout">
                        <div className="container-fluid">
                            <h2>Products</h2>
                            <div className="row">
                                { boxes }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var ProductLayout = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    render: function() {
        let image = "public/" + this.props.image,
            name = this.props.name,
            mkid = this.props.mkid;

        return (
            <div className="col-sm-6 col-md-12 text-center" style={{ padding: "15px" }}>
                <div className="product">
                    <img width="50%" src={ image } />
                    <h3>{ name }</h3>
                </div>
            </div>
        );
    }
});

var AuthLayout = React.createClass({
    render: function() {
        return (
            <div id="auth" className="auth">
                <header className="auth-header"></header>
                <div className="results">
                    {this.props.children}
                </div>
            </div>
        )
    }
})

var LoginForm = React.createClass({
    ValidateLogin: function() {
        var user = this.refs.LoginUser.state.value;
        var password = this.refs.LoginPassword.state.value;
        Login(user, password).then(function(status) {
            if (status == "failed") {
                $(".bg-danger").toggleClass("invisible", false);
            }
        });
    },
    render() {
        return (
            <form className="form-signin">
                <p className="bg-danger invisible" style={{ padding: "10px" }}>Login has faild! Please try again.</p>
                <h2 className="form-signin-heading">Please sign in</h2>
                <UserField ref="LoginUser"/>
                <PasswordField ref="LoginPassword"/>
                <SignIn ValidateLogin={this.ValidateLogin}/>
                <a className="btn btn-lg btn-default btn-block" href="#/register">Sign up</a>
            </form>
        )
    }
});

var RegisterForm = React.createClass({
    ValidateRegister: function() {
        var user = this.refs.LoginUser.state.value;
        var password = this.refs.LoginPassword.state.value;
        Register(user, password);
    },
    render() {
        return (
            <form className="form-signin">
                <h2 className="form-signin-heading">Please sign up</h2>
                <UserField ref="LoginUser"/>
                <PasswordField ref="LoginPassword"/>
                <SignUp ValidateRegister={this.ValidateRegister}/>
            </form>
        )
    }
});

var UserField = React.createClass({
    getInitialState() {
        return {value: null}
    },
    onChange(e) {
        this.setState({value: e.target.value});
    },
    render() {
        return (
            <div className="LoginUserDiv">
                <label htmlFor="inputUser" className="sr-only">Username</label>
                <input type="text" id="inputUser" className="form-control" placeholder="Username" required="" onChange={this.onChange}/>
            </div>
        )
    }
});

var PasswordField = React.createClass({
    getInitialState() {
        return {value: null}
    },
    onChange(e) {
        this.setState({value: e.target.value});
    },
    render() {
        return (
            <div className="LoginPasswordDiv">
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" onChange={this.onChange}/>
            </div>
        )
    }
});

var SignIn = React.createClass({
    onClick() {
        this.props.ValidateLogin();
    },
    render() {
        return (
            <button className="btn btn-lg btn-primary btn-block" onClick={this.onClick}>Sign in</button>
        )
    }
});

var SignUp = React.createClass({
    onClick() {
        this.props.ValidateRegister();
    },
    render() {
        return (
            <a className="btn btn-lg btn-default btn-block" onClick={this.onClick}>Sign up</a>
        )
    }
});

function Login(user, password) {
    var deferred = $.Deferred();

    db.select("users", function([u, p], value) {
        return (u == user && p == password);
    }).done(function(items) {
        if (items.length > 0) {
            localStorage.setItem('currentUser', user);
            hashHistory.push("/");
        } else {
            deferred.resolve("failed");
        }
    });

    return deferred.promise();
};

function Register(user, password) {
    var data = {
        "user": user,
        "password": password,
    };

    db.put(data, "users").done(function() {
        hashHistory.push("/login");
    });
};

function getDemoData() {
    return [
        {
            'image': "product.png",
            'mkid': 0,
            'name': "Product 1"
        },
        {
            'image': "product.png",
            'mkid': 1,
            'name': "Product 2"
        },
        {
            'image': "product.png",
            'mkid': 2,
            'name': "Product 3"
        },
        {
            'image': "product.png",
            'mkid': 3,
            'name': "Product 4"
        },
        {
            'image': "product.png",
            'mkid': 4,
            'name': "Product 5"
        },
        {
            'image': "product.png",
            'mkid': 5,
            'name': "Product 6"
        },
    ];
}

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={MainLayout}>
            <IndexRoute component={HomePage} />
            <Route component={AuthLayout}>
                <Route path="/login" component={LoginForm} />
                <Route path="/register" component={RegisterForm} />
            </Route>
            <Route>
                <Route path="/products" component={ProductsLayout} />
            </Route>
        </Route>
    </Router>
), document.getElementById('app'));
