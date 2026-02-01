function GrievancePanel() {
  return (
    <>
      {/* FULL PAGE LAYOUT */}
      <div className="">


        {/* MAIN CONTENT (SCROLLABLE) */}
        <div className="flex-grow-1 overflow-auto">
          <div className="container mt-4 mb-4">
            <div className="row">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-body">
                    <h4 className="mb-3">Grievance Panel</h4>

                    <p className="text-muted">
                      View and manage grievances submitted by students and teachers.
                    </p>

                    <div className="alert alert-info mt-3">
                      No grievances available at the moment.
                    </div>

                    {/* Dummy content to test scrolling */}
                    <div style={{ height: "800px" }}></div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GrievancePanel;
