import React, { useState, useEffect } from "react";

const dict = {
  en: {
    title: "Job Application Tracker",
    company: "Company Name",
    position: "Position",
    addBtn: "Add",
    saveBtn: "Save",
    cancelBtn: "Cancel",
    pendingCol: "Pending",
    interviewCol: "Interview",
    resolvedCol: "Resolved",
    noPending: "No pending applications.",
    noInterview: "No applications in interview.",
    noResolved: "No resolved applications.",
    alertEmpty: "Please fill in all fields with valid characters!",
    btnInterview: "Interview",
    btnResolve: "Resolve",
    btnReset: "Reset",
    emptyError: "Fields cannot be left empty!",
  },
  tr: {
    title: "İş Başvurusu Takip Panosu",
    company: "Şirket Adı",
    position: "Pozisyon",
    addBtn: "Ekle",
    saveBtn: "Kaydet",
    cancelBtn: "İptal",
    pendingCol: "Beklemede",
    interviewCol: "Mülakat",
    resolvedCol: "Sonuçlandı",
    noPending: "Bekleyen başvuru yok.",
    noInterview: "Mülakat aşamasında başvuru yok.",
    noResolved: "Sonuçlanan başvuru yok.",
    alertEmpty: "Lütfen tüm alanları geçerli karakterlerle doldurun!",
    btnInterview: "Mülakata Taşı",
    btnResolve: "Sonuçlandır",
    btnReset: "Başa Al",
    emptyError: "Alanlar boş bırakılamaz!",
  },
};

function App() {
  const [lang, setLang] = useState(
    () => localStorage.getItem("appLang") || "en",
  );

  // YENİ: Karanlık/Aydınlık mod hafızası
  const [theme, setTheme] = useState(
    () => localStorage.getItem("appTheme") || "light",
  );

  const [applications, setApplications] = useState(() => {
    const savedData = localStorage.getItem("myApplications");
    return savedData ? JSON.parse(savedData) : [];
  });

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    company: "",
    position: "",
    date: "",
  });

  // YENİ: Tema değiştiğinde HTML'in ana etiketine karanlık mod sinyali gönderir
  useEffect(() => {
    localStorage.setItem("appTheme", theme);
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("myApplications", JSON.stringify(applications));
    localStorage.setItem("appLang", lang);
  }, [applications, lang]);

  const todayDate = new Date().toISOString().split("T")[0];
  const t = dict[lang];

  const handleAdd = () => {
    if (!company.trim() || !position.trim() || !date) {
      alert(t.alertEmpty);
      return;
    }
    const newApplication = {
      id: Date.now(),
      company: company.trim(),
      position: position.trim(),
      date: date,
      status: "pending",
    };
    setApplications([...applications, newApplication]);
    setCompany("");
    setPosition("");
    setDate("");
  };

  const handleDelete = (id) => {
    const updatedApplications = applications.filter((app) => app.id !== id);
    setApplications(updatedApplications);
  };

  const handleStatusUpdate = (id, newStatus) => {
    const updatedApplications = applications.map((app) =>
      app.id === id ? { ...app, status: newStatus } : app,
    );
    setApplications(updatedApplications);
  };

  const startEditing = (app) => {
    setEditingId(app.id);
    setEditFormData({
      company: app.company,
      position: app.position,
      date: app.date,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const saveEdit = (id) => {
    if (
      !editFormData.company.trim() ||
      !editFormData.position.trim() ||
      !editFormData.date
    ) {
      alert(t.emptyError);
      return;
    }
    const updatedApplications = applications.map((app) =>
      app.id === id
        ? {
            ...app,
            company: editFormData.company.trim(),
            position: editFormData.position.trim(),
            date: editFormData.date,
          }
        : app,
    );
    setApplications(updatedApplications);
    setEditingId(null);
  };

  const renderCardContent = (app) => {
    if (editingId === app.id) {
      return (
        <div className="card-body">
          <input
            type="text"
            name="company"
            value={editFormData.company}
            onChange={handleEditChange}
            className="form-control mb-2 form-control-sm"
            placeholder={t.company}
          />
          <input
            type="text"
            name="position"
            value={editFormData.position}
            onChange={handleEditChange}
            className="form-control mb-2 form-control-sm"
            placeholder={t.position}
          />
          <input
            type="date"
            name="date"
            value={editFormData.date}
            onChange={handleEditChange}
            max={todayDate}
            className="form-control mb-3 form-control-sm"
          />
          <div className="d-flex justify-content-between">
            <button
              onClick={() => saveEdit(app.id)}
              className="btn btn-sm btn-success w-50 me-1"
            >
              <i className="bi bi-check-circle"></i> {t.saveBtn}
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="btn btn-sm btn-secondary w-50 ms-1"
            >
              <i className="bi bi-x-circle"></i> {t.cancelBtn}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 className="card-title fw-bold mb-0">{app.company}</h5>
            <h6 className="card-subtitle text-muted mt-1">{app.position}</h6>
          </div>
          <button
            onClick={() => startEditing(app)}
            className="btn btn-sm btn-link text-secondary border-0 p-0"
            title="Edit"
          >
            <i className="bi bi-pencil-square fs-5"></i>
          </button>
        </div>
        <p className="card-text small mb-3 text-secondary">
          <i className="bi bi-calendar-event"></i> {app.date}
        </p>
        <div className="d-flex justify-content-between">
          {app.status === "pending" && (
            <button
              onClick={() => handleStatusUpdate(app.id, "interview")}
              className="btn btn-sm btn-outline-primary"
            >
              <i className="bi bi-arrow-right-circle"></i> {t.btnInterview}
            </button>
          )}
          {app.status === "interview" && (
            <button
              onClick={() => handleStatusUpdate(app.id, "resolved")}
              className="btn btn-sm btn-outline-success"
            >
              <i className="bi bi-check2-all"></i> {t.btnResolve}
            </button>
          )}
          {app.status === "resolved" && (
            <button
              onClick={() => handleStatusUpdate(app.id, "pending")}
              className="btn btn-sm btn-outline-secondary"
            >
              <i className="bi bi-arrow-counterclockwise"></i> {t.btnReset}
            </button>
          )}
          <button
            onClick={() => handleDelete(app.id)}
            className="btn btn-sm btn-outline-danger"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-5 mb-5">
      {/* BAŞLIK, TEMA VE DİL SEÇİM BUTONLARI */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0 mb-3 mb-md-0">
          <i className="bi bi-kanban"></i> {t.title}
        </h2>

        <div className="d-flex gap-3">
          {/* TEMA (GÜNDÜZ/GECE) BUTONU */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="btn btn-outline-secondary shadow-sm rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "40px", height: "40px" }}
            title="Toggle Theme"
          >
            {theme === "light" ? (
              <i className="bi bi-moon-stars-fill text-dark"></i>
            ) : (
              <i className="bi bi-sun-fill text-warning"></i>
            )}
          </button>

          {/* DİL BUTONLARI */}
          <div className="btn-group shadow-sm">
            <button
              onClick={() => setLang("tr")}
              className={`btn btn-sm ${lang === "tr" ? (theme === "dark" ? "btn-light" : "btn-dark") : "btn-outline-secondary"}`}
            >
              TR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`btn btn-sm ${lang === "en" ? (theme === "dark" ? "btn-light" : "btn-dark") : "btn-outline-secondary"}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder={t.company}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                maxLength="40"
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder={t.position}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                maxLength="40"
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={date}
                max={todayDate}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button
                onClick={handleAdd}
                className={`btn w-100 fw-bold ${theme === "dark" ? "btn-light" : "btn-dark"}`}
              >
                <i className="bi bi-plus-lg"></i> {t.addBtn}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="kanban-col p-3 h-100">
            <h5 className="text-center text-secondary border-bottom pb-2 fw-bold">
              <i className="bi bi-hourglass-split"></i> {t.pendingCol}
            </h5>
            {applications.filter((app) => app.status === "pending").length ===
              0 && (
              <p className="text-center text-muted mt-3 small">{t.noPending}</p>
            )}
            {applications
              .filter((app) => app.status === "pending")
              .map((app) => (
                <div
                  key={app.id}
                  className="card mt-3 shadow-sm border-secondary"
                >
                  {renderCardContent(app)}
                </div>
              ))}
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="kanban-col p-3 h-100">
            <h5 className="text-center text-primary border-bottom pb-2 fw-bold">
              <i className="bi bi-chat-dots"></i> {t.interviewCol}
            </h5>
            {applications.filter((app) => app.status === "interview").length ===
              0 && (
              <p className="text-center text-muted mt-3 small">
                {t.noInterview}
              </p>
            )}
            {applications
              .filter((app) => app.status === "interview")
              .map((app) => (
                <div
                  key={app.id}
                  className="card mt-3 shadow-sm border-primary"
                >
                  {renderCardContent(app)}
                </div>
              ))}
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="kanban-col p-3 h-100">
            <h5 className="text-center text-success border-bottom pb-2 fw-bold">
              <i className="bi bi-award"></i> {t.resolvedCol}
            </h5>
            {applications.filter((app) => app.status === "resolved").length ===
              0 && (
              <p className="text-center text-muted mt-3 small">
                {t.noResolved}
              </p>
            )}
            {applications
              .filter((app) => app.status === "resolved")
              .map((app) => (
                <div
                  key={app.id}
                  className="card mt-3 shadow-sm border-success"
                >
                  {renderCardContent(app)}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1000 }}
      >
        <small
          className={`fw-bold ${theme === "dark" ? "text-light" : "text-muted"}`}
          style={{ opacity: 0.7 }}
        >
          Made by CemGoktanOzgul
        </small>
      </div>
    </div>
  );
}

export default App;
