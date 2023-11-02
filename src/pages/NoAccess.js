export default function NoAccess() {
    return (
      <div className="logo">
      <header>
            <div className="image-text text-center">
              <span className="image" style={{ width: "100%" }}>
                <img src="logo.png" alt="" />
              </span>
            </div>
          </header>
      <div className="main_logout">
        <h3>You do not have access to this application. Please connect to administrator for access.</h3>
      </div>
      </div>
    );
  }