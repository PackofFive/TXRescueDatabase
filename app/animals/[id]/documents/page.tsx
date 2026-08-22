"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

type Visibility =
  | "private"
  | "approved_foster"
  | "public";

type AnimalDocument = {
  id: string;
  animal_id: string;
  org_id: string;

  title: string;
  category: string;

  document_date:
    | string
    | null;

  source:
    | string
    | null;

  notes:
    | string
    | null;

  original_filename: string;
  content_type: string;

  file_size:
    | number
    | string;

  visibility:
    Visibility;

  uploaded_by:
    | string
    | null;

  uploaded_by_email:
    | string
    | null;

  created_at: string;
  updated_at: string;
};

type AnimalPhoto = {
  id: string;
  url: string;
  source:
    | string
    | null;
  visibility:
    | string
    | null;
};

type AnimalSummary = {
  id: string;

  name:
    | string
    | null;

  temporary_name:
    | string
    | null;

  photo:
    | AnimalPhoto
    | null;
};

type DocumentDraft = {
  title: string;
  category: string;
  documentDate: string;
  source: string;
  notes: string;
  visibility: Visibility;
};

const DOCUMENT_CATEGORIES = [
  {
    value: "intake",
    label: "Intake",
  },
  {
    value: "shelter",
    label: "Shelter Paperwork",
  },
  {
    value: "ownership_release",
    label: "Ownership / Release",
  },
  {
    value: "microchip",
    label: "Microchip",
  },
  {
    value: "identification",
    label: "Identification",
  },
  {
    value: "transport",
    label: "Transport",
  },
  {
    value: "adoption",
    label: "Adoption",
  },
  {
    value: "certificate",
    label: "Certificate",
  },
  {
    value: "receipt",
    label: "Receipt",
  },
  {
    value: "other",
    label: "Other",
  },
];

const VISIBILITY_OPTIONS: {
  value: Visibility;
  label: string;
  help: string;
}[] = [
  {
    value: "private",
    label: "Private",
    help:
      "Organization staff only.",
  },
  {
    value:
      "approved_foster",
    label:
      "Approved Foster",
    help:
      "May later be shared with an authorized foster assigned to this animal.",
  },
  {
    value: "public",
    label:
      "Approved for Public Use",
    help:
      "Approved by the rescue for possible public use. This does not automatically publish the file.",
  },
];

export default function DocumentsPage() {
  const params =
    useParams();

  const animalId =
    params?.id as string;

  const [
    animal,
    setAnimal,
  ] =
    useState<AnimalSummary | null>(
      null
    );

  const [
    documents,
    setDocuments,
  ] =
    useState<AnimalDocument[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const [
    message,
    setMessage,
  ] =
    useState<string | null>(
      null
    );

  /* =====================================================
     UPLOAD
  ===================================================== */

  const [
    showUpload,
    setShowUpload,
  ] =
    useState(false);

  const [
    uploadFile,
    setUploadFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    uploadDraft,
    setUploadDraft,
  ] =
    useState<DocumentDraft>(
      emptyDocumentDraft()
    );

  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  /* =====================================================
     EDIT
  ===================================================== */

  const [
    editingDocumentId,
    setEditingDocumentId,
  ] =
    useState<string | null>(
      null
    );

  const [
    editDraft,
    setEditDraft,
  ] =
    useState<DocumentDraft>(
      emptyDocumentDraft()
    );

  const [
    savingEdit,
    setSavingEdit,
  ] =
    useState(false);

  const [
    deletingDocumentId,
    setDeletingDocumentId,
  ] =
    useState<string | null>(
      null
    );

  const [
    settingProfilePhotoId,
    setSettingProfilePhotoId,
  ] =
    useState<string | null>(
      null
    );

  /* =====================================================
     FILTERS
  ===================================================== */

  const [
    categoryFilter,
    setCategoryFilter,
  ] =
    useState("");

  const [
    visibilityFilter,
    setVisibilityFilter,
  ] =
    useState("");

  const [
    search,
    setSearch,
  ] =
    useState("");

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    if (!animalId) {
      return;
    }

    loadPage();
  }, [animalId]);

  async function loadPage() {
    setLoading(true);
    setError(null);

    try {
      const [
        animalRes,
        documentsRes,
      ] =
        await Promise.all([
          fetch(
            `/api/animals/${encodeURIComponent(
              animalId
            )}`,
            {
              cache:
                "no-store",

              credentials:
                "same-origin",
            }
          ),

          fetch(
            `/api/animals/${encodeURIComponent(
              animalId
            )}/documents`,
            {
              cache:
                "no-store",

              credentials:
                "same-origin",
            }
          ),
        ]);

      const [
        animalData,
        documentsData,
      ] =
        await Promise.all([
          animalRes.json(),
          documentsRes.json(),
        ]);

      if (!animalRes.ok) {
        throw new Error(
          animalData.error ??
            "Couldn't load animal."
        );
      }

      if (!documentsRes.ok) {
        throw new Error(
          documentsData.error ??
            "Couldn't load documents."
        );
      }

      setAnimal(
        animalData.animal ??
          null
      );

      setDocuments(
        Array.isArray(
          documentsData.documents
        )
          ? documentsData.documents
          : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load documents."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     FILTERED DOCUMENTS
  ===================================================== */

  const filteredDocuments =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return documents.filter(
        (document) => {
          if (
            categoryFilter &&
            document.category !==
              categoryFilter
          ) {
            return false;
          }

          if (
            visibilityFilter &&
            document.visibility !==
              visibilityFilter
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          const haystack =
            [
              document.title,
              document.original_filename,
              document.source,
              document.notes,
              document.category,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          return haystack.includes(
            query
          );
        }
      );
    }, [
      documents,
      categoryFilter,
      visibilityFilter,
      search,
    ]);

  /* =====================================================
     UPLOAD
  ===================================================== */

  function beginUpload() {
    setShowUpload(
      true
    );

    setUploadFile(
      null
    );

    setUploadDraft(
      emptyDocumentDraft()
    );

    setError(null);
    setMessage(null);
  }

  function cancelUpload() {
    setShowUpload(
      false
    );

    setUploadFile(
      null
    );

    setUploadDraft(
      emptyDocumentDraft()
    );
  }

  async function uploadDocument(
    event:
      React.FormEvent
  ) {
    event.preventDefault();

    if (!uploadFile) {
      setError(
        "Select a PDF or image to upload."
      );

      return;
    }

    setUploading(
      true
    );

    setError(null);
    setMessage(null);

    try {
      const formData =
        new FormData();

      formData.set(
        "file",
        uploadFile
      );

      formData.set(
        "title",
        uploadDraft.title
      );

      formData.set(
        "category",
        uploadDraft.category
      );

      formData.set(
        "documentDate",
        uploadDraft.documentDate
      );

      formData.set(
        "source",
        uploadDraft.source
      );

      formData.set(
        "notes",
        uploadDraft.notes
      );

      formData.set(
        "visibility",
        uploadDraft.visibility
      );

      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/documents`,
          {
            method:
              "POST",

            credentials:
              "same-origin",

            body:
              formData,
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't upload document."
        );
      }

      setMessage(
        "Document uploaded."
      );

      cancelUpload();

      await loadPage();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't upload document."
      );
    } finally {
      setUploading(
        false
      );
    }
  }

  /* =====================================================
     EDIT DOCUMENT
  ===================================================== */

  function beginEdit(
    document:
      AnimalDocument
  ) {
    setEditingDocumentId(
      document.id
    );

    setEditDraft({
      title:
        document.title,

      category:
        document.category,

      documentDate:
        document.document_date
          ? String(
              document.document_date
            ).slice(
              0,
              10
            )
          : "",

      source:
        document.source ??
        "",

      notes:
        document.notes ??
        "",

      visibility:
        document.visibility,
    });

    setError(null);
    setMessage(null);
  }

  function cancelEdit() {
    setEditingDocumentId(
      null
    );

    setEditDraft(
      emptyDocumentDraft()
    );
  }

  async function saveEdit() {
    if (!editingDocumentId) {
      return;
    }

    if (
      !editDraft.title.trim()
    ) {
      setError(
        "Document title is required."
      );

      return;
    }

    setSavingEdit(
      true
    );

    setError(null);
    setMessage(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/documents`,
          {
            method:
              "PATCH",

            credentials:
              "same-origin",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                documentId:
                  editingDocumentId,

                title:
                  editDraft.title,

                category:
                  editDraft.category,

                documentDate:
                  editDraft.documentDate,

                source:
                  editDraft.source,

                notes:
                  editDraft.notes,

                visibility:
                  editDraft.visibility,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't update document."
        );
      }

      setEditingDocumentId(
        null
      );

      setEditDraft(
        emptyDocumentDraft()
      );

      setMessage(
        "Document updated."
      );

      await loadPage();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't update document."
      );
    } finally {
      setSavingEdit(
        false
      );
    }
  }

  /* =====================================================
     PROFILE PHOTO
  ===================================================== */

  async function setProfilePhoto(
    document:
      AnimalDocument
  ) {
    if (
      !document.content_type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Only image files can be used as the profile photo."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Set "${document.title}" as this animal's profile photo?`
      );

    if (!confirmed) {
      return;
    }

    setSettingProfilePhotoId(
      document.id
    );

    setError(null);
    setMessage(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/documents/profile-photo`,
          {
            method:
              "POST",

            credentials:
              "same-origin",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                documentId:
                  document.id,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't set profile photo."
        );
      }

      setMessage(
        "Profile photo updated."
      );

      await loadPage();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't set profile photo."
      );
    } finally {
      setSettingProfilePhotoId(
        null
      );
    }
  }

  /* =====================================================
     DELETE
  ===================================================== */

  async function deleteDocument(
    document:
      AnimalDocument
  ) {
    const confirmed =
      window.confirm(
        `Delete "${document.title}"?\n\nThis will permanently remove the stored file and its document record.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingDocumentId(
      document.id
    );

    setError(null);
    setMessage(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/documents`,
          {
            method:
              "DELETE",

            credentials:
              "same-origin",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                documentId:
                  document.id,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't delete document."
        );
      }

      if (
        editingDocumentId ===
        document.id
      ) {
        cancelEdit();
      }

      setMessage(
        "Document deleted."
      );

      await loadPage();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't delete document."
      );
    } finally {
      setDeletingDocumentId(
        null
      );
    }
  }

  /* =====================================================
     PAGE
  ===================================================== */

  if (loading) {
    return (
      <section>
        <p>Loading…</p>
      </section>
    );
  }

  const displayName =
    animal?.name ||
    animal?.temporary_name ||
    "Animal";

  return (
    <section
      style={{
        maxWidth:
          1100,
      }}
    >
      <a
        href={`/animals/${encodeURIComponent(
          animalId
        )}`}
        style={
          backLink
        }
      >
        ← Back to Animal
      </a>

      <div
        style={{
          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "flex-start",

          gap:
            16,

          margin:
            "14px 0 20px",

          flexWrap:
            "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin:
                0,

              fontSize:
                11.5,

              fontWeight:
                800,

              letterSpacing:
                ".08em",

              color:
                "#6B6862",

              textTransform:
                "uppercase",
            }}
          >
            Private Animal File
          </p>

          <h1
            style={{
              fontSize:
                28,

              margin:
                "5px 0 6px",

              color:
                "#17233C",
            }}
          >
            Documents & Photos
          </h1>

          <p
            style={{
              margin:
                0,

              color:
                "#6B6862",

              fontSize:
                13.5,

              lineHeight:
                1.5,

              maxWidth:
                760,
            }}
          >
            Store intake paperwork,
            shelter documents,
            ownership records,
            microchip information,
            transport files,
            adoption documents,
            identification, receipts,
            and other files for{" "}
            {displayName}. Veterinary
            records stay organized under
            Medical.
          </p>
        </div>

        <button
          type="button"
          onClick={
            beginUpload
          }
          style={
            primaryButton
          }
        >
          + Upload Document
        </button>
      </div>

      {error && (
        <Notice
          type="error"
        >
          {error}
        </Notice>
      )}

      {message && (
        <Notice
          type="success"
        >
          {message}
        </Notice>
      )}

      {/* ===============================================
          PHOTOS
      ================================================ */}

      <section
        style={
          panelStyle
        }
      >
        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            gap:
              12,

            alignItems:
              "flex-start",

            flexWrap:
              "wrap",
          }}
        >
          <div>
            <h2
              style={
                sectionTitle
              }
            >
              Animal Photos
            </h2>

            <p
              style={
                sectionDescription
              }
            >
              The animal&apos;s primary
              photo is shown here. A
              full multi-photo gallery
              can be added later without
              changing the document
              system.
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop:
              16,
          }}
        >
          {animal?.photo?.url ? (
            <div
              style={{
                display:
                  "flex",

                gap:
                  14,

                alignItems:
                  "flex-start",

                flexWrap:
                  "wrap",
              }}
            >
              <img
                src={
                  animal.photo.url
                }

                alt={
                  displayName
                }

                style={{
                  width:
                    180,

                  height:
                    180,

                  borderRadius:
                    10,

                  objectFit:
                    "cover",

                  border:
                    "1px solid #E7E5E1",

                  background:
                    "#F2F2F0",
                }}
              />

              <div
                style={{
                  minWidth:
                    220,

                  flex:
                    1,
                }}
              >
                <strong
                  style={{
                    display:
                      "block",

                    color:
                      "#17233C",

                    fontSize:
                      13.5,

                    marginBottom:
                      5,
                  }}
                >
                  Primary Animal Photo
                </strong>

                <div
                  style={{
                    color:
                      "#6B6862",

                    fontSize:
                      12.5,

                    lineHeight:
                      1.5,
                  }}
                >
                  {animal.photo.source
                    ? `Source: ${animal.photo.source}`
                    : "No photo source recorded."}
                </div>

                <div
                  style={{
                    marginTop:
                      4,

                    color:
                      "#6B6862",

                    fontSize:
                      12.5,
                  }}
                >
                  Visibility:{" "}
                  {animal.photo.visibility
                    ? formatValue(
                        animal.photo.visibility
                      )
                    : "Not recorded"}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={
                emptyState
              }
            >
              No primary animal photo is
              currently available.
            </div>
          )}
        </div>
      </section>

      {/* ===============================================
          UPLOAD
      ================================================ */}

      {showUpload && (
        <section
          style={
            panelStyle
          }
        >
          <div
            style={{
              display:
                "flex",

              justifyContent:
                "space-between",

              gap:
                12,

              alignItems:
                "flex-start",

              flexWrap:
                "wrap",

              marginBottom:
                16,
            }}
          >
            <div>
              <h2
                style={
                  sectionTitle
                }
              >
                Upload Document
              </h2>

              <p
                style={
                  sectionDescription
                }
              >
                PDF, JPG, PNG, or WebP.
                Maximum file size 15 MB.
              </p>
            </div>

            <button
              type="button"
              onClick={
                cancelUpload
              }
              style={
                textButton
              }
            >
              Close
            </button>
          </div>

          <form
            onSubmit={
              uploadDocument
            }
          >
            <Field
              label="File *"
            >
              <input
                type="file"

                required

                accept="application/pdf,image/jpeg,image/png,image/webp"

                onChange={(e) => {
                  const file =
                    e.target.files?.[0] ??
                    null;

                  setUploadFile(
                    file
                  );

                  if (
                    file &&
                    !uploadDraft.title
                  ) {
                    setUploadDraft(
                      (current) => ({
                        ...current,
                        title:
                          cleanFilenameForTitle(
                            file.name
                          ),
                      })
                    );
                  }
                }}

                style={
                  inputStyle
                }
              />
            </Field>

            {uploadFile && (
              <div
                style={{
                  margin:
                    "-4px 0 14px",

                  color:
                    "#6B6862",

                  fontSize:
                    12,
                }}
              >
                {uploadFile.name}
                {" · "}
                {formatFileSize(
                  uploadFile.size
                )}
              </div>
            )}

            <DocumentFormFields
              draft={
                uploadDraft
              }

              setDraft={
                setUploadDraft
              }
            />

            <div
              style={
                formActions
              }
            >
              <button
                type="submit"

                disabled={
                  uploading
                }

                style={
                  primaryButton
                }
              >
                {uploading
                  ? "Uploading…"
                  : "Upload Document"}
              </button>

              <button
                type="button"

                disabled={
                  uploading
                }

                onClick={
                  cancelUpload
                }

                style={
                  secondaryButton
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ===============================================
          FILTERS
      ================================================ */}

      <section
        style={
          panelStyle
        }
      >
        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "minmax(220px, 2fr) repeat(2, minmax(160px, 1fr))",

            gap:
              10,
          }}
        >
          <input
            value={
              search
            }

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            placeholder="Search documents…"

            style={
              inputStyle
            }
          />

          <select
            value={
              categoryFilter
            }

            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }

            style={
              inputStyle
            }
          >
            <option value="">
              All categories
            </option>

            {DOCUMENT_CATEGORIES.map(
              (category) => (
                <option
                  key={
                    category.value
                  }

                  value={
                    category.value
                  }
                >
                  {
                    category.label
                  }
                </option>
              )
            )}
          </select>

          <select
            value={
              visibilityFilter
            }

            onChange={(e) =>
              setVisibilityFilter(
                e.target.value
              )
            }

            style={
              inputStyle
            }
          >
            <option value="">
              All visibility
            </option>

            <option value="private">
              Private
            </option>

            <option value="approved_foster">
              Approved Foster
            </option>

            <option value="public">
              Approved for Public Use
            </option>
          </select>
        </div>
      </section>

      {/* ===============================================
          DOCUMENT LIST
      ================================================ */}

      <section
        style={
          panelStyle
        }
      >
        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            gap:
              12,

            flexWrap:
              "wrap",

            alignItems:
              "center",

            marginBottom:
              14,
          }}
        >
          <div>
            <h2
              style={
                sectionTitle
              }
            >
              Documents
            </h2>

            <p
              style={
                sectionDescription
              }
            >
              {
                filteredDocuments.length
              }{" "}
              document
              {filteredDocuments.length ===
              1
                ? ""
                : "s"}
              {" "}
              in this view
            </p>
          </div>
        </div>

        {filteredDocuments.length ===
        0 ? (
          <div
            style={
              emptyState
            }
          >
            No documents match this
            view.
          </div>
        ) : (
          <div
            style={{
              display:
                "grid",

              gap:
                9,
            }}
          >
            {filteredDocuments.map(
              (document) => (
                <DocumentCard
                  key={
                    document.id
                  }

                  document={
                    document
                  }

                  animalId={
                    animalId
                  }

                  editing={
                    editingDocumentId ===
                    document.id
                  }

                  editDraft={
                    editDraft
                  }

                  setEditDraft={
                    setEditDraft
                  }

                  savingEdit={
                    savingEdit
                  }

                  deleting={
                    deletingDocumentId ===
                    document.id
                  }

                  settingProfilePhoto={
                    settingProfilePhotoId ===
                    document.id
                  }

                  onBeginEdit={() =>
                    beginEdit(
                      document
                    )
                  }

                  onCancelEdit={
                    cancelEdit
                  }

                  onSaveEdit={
                    saveEdit
                  }

                  onSetProfilePhoto={() =>
                    setProfilePhoto(
                      document
                    )
                  }

                  onDelete={() =>
                    deleteDocument(
                      document
                    )
                  }
                />
              )
            )}
          </div>
        )}
      </section>
    </section>
  );
}

/* =========================================================
   DOCUMENT CARD
========================================================= */

function DocumentCard({
  document,
  animalId,
  editing,
  editDraft,
  setEditDraft,
  savingEdit,
  deleting,
  settingProfilePhoto,
  onBeginEdit,
  onCancelEdit,
  onSaveEdit,
  onSetProfilePhoto,
  onDelete,
}: {
  document:
    AnimalDocument;

  animalId:
    string;

  editing:
    boolean;

  editDraft:
    DocumentDraft;

  setEditDraft:
    React.Dispatch<
      React.SetStateAction<DocumentDraft>
    >;

  savingEdit:
    boolean;

  deleting:
    boolean;

  settingProfilePhoto:
    boolean;

  onBeginEdit:
    () => void;

  onCancelEdit:
    () => void;

  onSaveEdit:
    () => void;

  onSetProfilePhoto:
    () => void;

  onDelete:
    () => void;
}) {
  const [
    expanded,
    setExpanded,
  ] =
    useState(false);

  const openUrl =
    `/api/animals/${encodeURIComponent(
      animalId
    )}/documents?documentId=${encodeURIComponent(
      document.id
    )}`;

  const downloadUrl =
    `${openUrl}&download=true`;

  const isImage =
    document.content_type.startsWith(
      "image/"
    );

  return (
    <article
      style={{
        border:
          "1px solid #E7E5E1",

        borderRadius:
          9,

        overflow:
          "hidden",

        background:
          "#fff",
      }}
    >
      <button
        type="button"

        onClick={() =>
          setExpanded(
            (value) =>
              !value
          )
        }

        style={{
          width:
            "100%",

          border:
            "none",

          background:
            "#fff",

          padding:
            13,

          cursor:
            "pointer",

          textAlign:
            "left",

          fontFamily:
            "inherit",
        }}
      >
        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "minmax(180px, 1fr) auto",

            gap:
              12,

            alignItems:
              "center",
          }}
        >
          <div
            style={{
              minWidth:
                0,
            }}
          >
            <div
              style={{
                display:
                  "flex",

                gap:
                  6,

                flexWrap:
                  "wrap",

                alignItems:
                  "center",
              }}
            >
              <strong
                style={{
                  color:
                    "#17233C",

                  fontSize:
                    13.5,

                  overflowWrap:
                    "anywhere",
                }}
              >
                {
                  document.title
                }
              </strong>

              <CategoryBadge
                category={
                  document.category
                }
              />

              <VisibilityBadge
                visibility={
                  document.visibility
                }
              />
            </div>

            <div
              style={{
                marginTop:
                  5,

                color:
                  "#6B6862",

                fontSize:
                  12,
              }}
            >
              {document.document_date
                ? formatDate(
                    document.document_date
                  )
                : "No document date"}

              {" · "}

              {formatFileSize(
                Number(
                  document.file_size
                )
              )}

              {" · "}

              {formatFileType(
                document.content_type
              )}
            </div>
          </div>

          <span
            style={{
              color:
                "#6B6862",

              fontSize:
                11,
            }}
          >
            {expanded
              ? "▲"
              : "▼"}
          </span>
        </div>
      </button>

      {expanded && (
        <div
          style={{
            borderTop:
              "1px solid #EEECE8",

            padding:
              13,

            background:
              "#FCFCFB",
          }}
        >
          {editing ? (
            <>
              <DocumentFormFields
                draft={
                  editDraft
                }

                setDraft={
                  setEditDraft
                }
              />

              <div
                style={
                  formActions
                }
              >
                <button
                  type="button"

                  disabled={
                    savingEdit
                  }

                  onClick={
                    onSaveEdit
                  }

                  style={
                    primaryButton
                  }
                >
                  {savingEdit
                    ? "Saving…"
                    : "Save Changes"}
                </button>

                <button
                  type="button"

                  disabled={
                    savingEdit
                  }

                  onClick={
                    onCancelEdit
                  }

                  style={
                    secondaryButton
                  }
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {isImage && (
                <div
                  style={{
                    display:
                      "flex",

                    gap:
                      14,

                    alignItems:
                      "flex-start",

                    flexWrap:
                      "wrap",

                    marginBottom:
                      14,
                  }}
                >
                  <a
                    href={
                      openUrl
                    }

                    target="_blank"

                    rel="noreferrer"

                    style={{
                      display:
                        "inline-block",

                      textDecoration:
                        "none",
                    }}
                  >
                    <img
                      src={
                        openUrl
                      }

                      alt={
                        document.title
                      }

                      style={{
                        width:
                          140,

                        height:
                          105,

                        objectFit:
                          "cover",

                        borderRadius:
                          8,

                        border:
                          "1px solid #E7E5E1",

                        background:
                          "#F2F2F0",
                      }}
                    />
                  </a>

                  <div
                    style={{
                      flex:
                        1,

                      minWidth:
                        220,

                      border:
                        "1px solid #E0E3E7",

                      borderRadius:
                        8,

                      padding:
                        11,

                      background:
                        "#F8F9FA",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        gap:
                          12,

                        alignItems:
                          "center",

                        flexWrap:
                          "wrap",
                      }}
                    >
                      <div>
                        <strong
                          style={{
                            display:
                              "block",

                            color:
                              "#17233C",

                            fontSize:
                              12.5,
                          }}
                        >
                          Profile Photo
                        </strong>

                        <div
                          style={{
                            marginTop:
                              3,

                            color:
                              "#6B6862",

                            fontSize:
                              11.5,

                            lineHeight:
                              1.4,
                          }}
                        >
                          Use this image as the
                          animal&apos;s primary
                          profile photo.
                        </div>
                      </div>

                      <button
                        type="button"

                        disabled={
                          settingProfilePhoto
                        }

                        onClick={
                          onSetProfilePhoto
                        }

                        aria-label="Set as profile photo"

                        style={{
                          position:
                            "relative",

                          width:
                            46,

                          height:
                            26,

                          border:
                            "none",

                          borderRadius:
                            999,

                          background:
                            settingProfilePhoto
                              ? "#A9C8B5"
                              : "#D8DCE1",

                          cursor:
                            settingProfilePhoto
                              ? "wait"
                              : "pointer",

                          padding:
                            0,

                          flexShrink:
                            0,
                        }}
                      >
                        <span
                          style={{
                            position:
                              "absolute",

                            top:
                              3,

                            left:
                              3,

                            width:
                              20,

                            height:
                              20,

                            borderRadius:
                              "50%",

                            background:
                              "#fff",

                            boxShadow:
                              "0 1px 2px rgba(0,0,0,.18)",
                          }}
                        />
                      </button>
                    </div>

                    <div
                      style={{
                        marginTop:
                          7,

                        fontSize:
                          11,

                        color:
                          "#8A8782",
                      }}
                    >
                      {settingProfilePhoto
                        ? "Setting profile photo…"
                        : "Turn on to set this image as the profile photo."}
                    </div>
                  </div>
                </div>
              )}

              <DetailRow
                label="Original file"
                value={
                  document.original_filename
                }
              />

              <DetailRow
                label="Category"
                value={
                  formatCategory(
                    document.category
                  )
                }
              />

              <DetailRow
                label="Visibility"
                value={
                  formatVisibility(
                    document.visibility
                  )
                }
              />

              {document.source && (
                <DetailRow
                  label="Source"
                  value={
                    document.source
                  }
                />
              )}

              {document.notes && (
                <div
                  style={{
                    marginTop:
                      10,
                  }}
                >
                  <div
                    style={
                      detailLabel
                    }
                  >
                    Notes
                  </div>

                  <div
                    style={{
                      color:
                        "#3F3D39",

                      fontSize:
                        13,

                      lineHeight:
                        1.55,

                      whiteSpace:
                        "pre-wrap",
                    }}
                  >
                    {
                      document.notes
                    }
                  </div>
                </div>
              )}

              {document.uploaded_by_email && (
                <div
                  style={{
                    marginTop:
                      10,

                    color:
                      "#8A8782",

                    fontSize:
                      11.5,
                  }}
                >
                  Uploaded by{" "}
                  {
                    document.uploaded_by_email
                  }
                </div>
              )}

              <div
                style={{
                  display:
                    "flex",

                  gap:
                    8,

                  flexWrap:
                    "wrap",

                  marginTop:
                    14,

                  paddingTop:
                    12,

                  borderTop:
                    "1px solid #EEECE8",
                }}
              >
                <a
                  href={
                    openUrl
                  }

                  target="_blank"

                  rel="noreferrer"

                  style={
                    primaryLink
                  }
                >
                  Open File
                </a>

                <a
                  href={
                    downloadUrl
                  }

                  style={
                    secondaryLink
                  }
                >
                  Download
                </a>

                <button
                  type="button"

                  onClick={
                    onBeginEdit
                  }

                  style={
                    secondaryButton
                  }
                >
                  Edit Details
                </button>

                <button
                  type="button"

                  disabled={
                    deleting
                  }

                  onClick={
                    onDelete
                  }

                  style={
                    deleteButton
                  }
                >
                  {deleting
                    ? "Deleting…"
                    : "Delete"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </article>
  );
}

/* =========================================================
   FORM FIELDS
========================================================= */

function DocumentFormFields({
  draft,
  setDraft,
}: {
  draft:
    DocumentDraft;

  setDraft:
    React.Dispatch<
      React.SetStateAction<DocumentDraft>
    >;
}) {
  function update(
    field:
      keyof DocumentDraft,

    value:
      string
  ) {
    setDraft(
      (current) => ({
        ...current,

        [field]:
          value,
      })
    );
  }

  return (
    <>
      <div
        style={
          formGrid
        }
      >
        <Field
          label="Title *"
        >
          <input
            value={
              draft.title
            }

            onChange={(e) =>
              update(
                "title",
                e.target.value
              )
            }

            style={
              inputStyle
            }
          />
        </Field>

        <Field
          label="Category"
        >
          <select
            value={
              draft.category
            }

            onChange={(e) =>
              update(
                "category",
                e.target.value
              )
            }

            style={
              inputStyle
            }
          >
            {DOCUMENT_CATEGORIES.map(
              (category) => (
                <option
                  key={
                    category.value
                  }

                  value={
                    category.value
                  }
                >
                  {
                    category.label
                  }
                </option>
              )
            )}
          </select>
        </Field>

        <Field
          label="Document Date"
        >
          <input
            type="date"

            value={
              draft.documentDate
            }

            onChange={(e) =>
              update(
                "documentDate",
                e.target.value
              )
            }

            style={
              inputStyle
            }
          />
        </Field>

        <Field
          label="Source"
        >
          <input
            value={
              draft.source
            }

            onChange={(e) =>
              update(
                "source",
                e.target.value
              )
            }

            placeholder="Shelter, owner, transporter, microchip company, etc."

            style={
              inputStyle
            }
          />
        </Field>
      </div>

      <div
        style={{
          marginTop:
            12,
        }}
      >
        <Field
          label="Visibility"
        >
          <select
            value={
              draft.visibility
            }

            onChange={(e) =>
              update(
                "visibility",
                e.target.value
              )
            }

            style={
              inputStyle
            }
          >
            {VISIBILITY_OPTIONS.map(
              (option) => (
                <option
                  key={
                    option.value
                  }

                  value={
                    option.value
                  }
                >
                  {
                    option.label
                  }
                </option>
              )
            )}
          </select>

          <div
            style={{
              marginTop:
                5,

              fontSize:
                11.5,

              lineHeight:
                1.45,

              color:
                "#6B6862",
            }}
          >
            {
              VISIBILITY_OPTIONS.find(
                (option) =>
                  option.value ===
                  draft.visibility
              )?.help
            }
          </div>
        </Field>
      </div>

      <div
        style={{
          marginTop:
            12,
        }}
      >
        <Field
          label="Notes"
        >
          <textarea
            rows={3}

            value={
              draft.notes
            }

            onChange={(e) =>
              update(
                "notes",
                e.target.value
              )
            }

            style={
              textareaStyle
            }
          />
        </Field>
      </div>
    </>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function Field({
  label,
  children,
}: {
  label:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <label>
      <span
        style={{
          display:
            "block",

          marginBottom:
            5,

          fontSize:
            11.5,

          color:
            "#6B6862",

          fontWeight:
            700,
        }}
      >
        {label}
      </span>

      {children}
    </label>
  );
}

function DetailRow({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div
      style={{
        display:
          "grid",

        gridTemplateColumns:
          "140px minmax(0, 1fr)",

        gap:
          10,

        padding:
          "5px 0",
      }}
    >
      <div
        style={
          detailLabel
        }
      >
        {label}
      </div>

      <div
        style={{
          color:
            "#3F3D39",

          fontSize:
            12.5,

          overflowWrap:
            "anywhere",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function CategoryBadge({
  category,
}: {
  category:
    string;
}) {
  return (
    <span
      style={{
        display:
          "inline-block",

        borderRadius:
          20,

        padding:
          "3px 7px",

        fontSize:
          10.5,

        fontWeight:
          700,

        background:
          "#EEF1F5",

        color:
          "#52627A",
      }}
    >
      {formatCategory(
        category
      )}
    </span>
  );
}

function VisibilityBadge({
  visibility,
}: {
  visibility:
    Visibility;
}) {
  const background =
    visibility ===
    "private"
      ? "#F0F0EE"
      : visibility ===
        "approved_foster"
      ? "#EEF4F0"
      : "#FFF3D9";

  const color =
    visibility ===
    "private"
      ? "#6B6862"
      : visibility ===
        "approved_foster"
      ? "#2F6F4E"
      : "#85571F";

  return (
    <span
      style={{
        display:
          "inline-block",

        borderRadius:
          20,

        padding:
          "3px 7px",

        fontSize:
          10.5,

        fontWeight:
          700,

        background,

        color,
      }}
    >
      {formatVisibility(
        visibility
      )}
    </span>
  );
}

function Notice({
  type,
  children,
}: {
  type:
    | "success"
    | "error";

  children:
    React.ReactNode;
}) {
  return (
    <div
      style={{
        padding:
          11,

        marginBottom:
          14,

        borderRadius:
          8,

        background:
          type ===
          "error"
            ? "#FFF4F2"
            : "#EEF4F0",

        border:
          type ===
          "error"
            ? "1px solid #F3C7BF"
            : "1px solid #C9DDD1",

        color:
          type ===
          "error"
            ? "#B23B2E"
            : "#2F6F4E",

        fontSize:
          13,
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function emptyDocumentDraft():
  DocumentDraft {
  return {
    title:
      "",

    category:
      "other",

    documentDate:
      "",

    source:
      "",

    notes:
      "",

    visibility:
      "private",
  };
}

function cleanFilenameForTitle(
  filename:
    string
) {
  return filename
    .replace(
      /\.[^.]+$/,
      ""
    )
    .replace(
      /[_-]+/g,
      " "
    )
    .trim();
}

function formatCategory(
  value:
    string
) {
  const found =
    DOCUMENT_CATEGORIES.find(
      (category) =>
        category.value ===
        value
    );

  return found?.label ??
    formatValue(
      value
    );
}

function formatVisibility(
  value:
    string
) {
  if (
    value ===
    "approved_foster"
  ) {
    return "Approved Foster";
  }

  if (
    value ===
    "public"
  ) {
    return "Approved for Public Use";
  }

  return "Private";
}

function formatFileType(
  contentType:
    string
) {
  if (
    contentType ===
    "application/pdf"
  ) {
    return "PDF";
  }

  if (
    contentType ===
    "image/jpeg"
  ) {
    return "JPG";
  }

  if (
    contentType ===
    "image/png"
  ) {
    return "PNG";
  }

  if (
    contentType ===
    "image/webp"
  ) {
    return "WebP";
  }

  return contentType;
}

function formatFileSize(
  bytes:
    number
) {
  if (
    !Number.isFinite(
      bytes
    ) ||
    bytes < 0
  ) {
    return "Unknown size";
  }

  if (
    bytes <
    1024
  ) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 *
      1024
  ) {
    return `${(
      bytes /
      1024
    ).toFixed(
      1
    )} KB`;
  }

  return `${(
    bytes /
    (
      1024 *
      1024
    )
  ).toFixed(
    1
  )} MB`;
}

function formatDate(
  value:
    string
) {
  const text =
    String(
      value
    ).slice(
      0,
      10
    );

  const date =
    new Date(
      `${text}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return text;
  }

  return date.toLocaleDateString(
    [],
    {
      month:
        "short",

      day:
        "numeric",

      year:
        "numeric",
    }
  );
}

function formatValue(
  value:
    string
) {
  return value
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (
        letter
      ) =>
        letter.toUpperCase()
    );
}

/* =========================================================
   STYLES
========================================================= */

const backLink:
  React.CSSProperties =
{
  color:
    "#52627A",

  fontSize:
    13,

  fontWeight:
    700,

  textDecoration:
    "none",
};

const panelStyle:
  React.CSSProperties =
{
  background:
    "#fff",

  border:
    "1px solid #E7E5E1",

  borderRadius:
    10,

  padding:
    18,

  marginBottom:
    16,
};

const sectionTitle:
  React.CSSProperties =
{
  margin:
    0,

  color:
    "#17233C",

  fontSize:
    17,
};

const sectionDescription:
  React.CSSProperties =
{
  margin:
    "4px 0 0",

  color:
    "#6B6862",

  fontSize:
    12.5,

  lineHeight:
    1.5,
};

const formGrid:
  React.CSSProperties =
{
  display:
    "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(210px, 1fr))",

  gap:
    12,
};

const formActions:
  React.CSSProperties =
{
  display:
    "flex",

  gap:
    8,

  flexWrap:
    "wrap",

  marginTop:
    16,
};

const inputStyle:
  React.CSSProperties =
{
  width:
    "100%",

  boxSizing:
    "border-box",

  border:
    "1px solid #D8D6D2",

  borderRadius:
    7,

  padding:
    9,

  background:
    "#fff",

  color:
    "#1C1B19",

  fontFamily:
    "inherit",

  fontSize:
    13,
};

const textareaStyle:
  React.CSSProperties =
{
  ...inputStyle,

  resize:
    "vertical",

  lineHeight:
    1.5,
};

const primaryButton:
  React.CSSProperties =
{
  background:
    "#17233C",

  color:
    "#fff",

  border:
    "none",

  borderRadius:
    7,

  padding:
    "9px 14px",

  fontWeight:
    700,

  fontSize:
    13,

  cursor:
    "pointer",
};

const secondaryButton:
  React.CSSProperties =
{
  background:
    "#fff",

  color:
    "#17233C",

  border:
    "1px solid #D8D6D2",

  borderRadius:
    7,

  padding:
    "9px 14px",

  fontWeight:
    700,

  fontSize:
    13,

  cursor:
    "pointer",
};

const textButton:
  React.CSSProperties =
{
  background:
    "transparent",

  color:
    "#6B6862",

  border:
    "none",

  padding:
    8,

  cursor:
    "pointer",

  fontSize:
    13,
};

const deleteButton:
  React.CSSProperties =
{
  background:
    "#fff",

  color:
    "#B23B2E",

  border:
    "1px solid #E2B8B1",

  borderRadius:
    6,

  padding:
    "7px 10px",

  fontSize:
    12,

  fontWeight:
    700,

  cursor:
    "pointer",
};

const primaryLink:
  React.CSSProperties =
{
  ...primaryButton,

  textDecoration:
    "none",

  display:
    "inline-block",
};

const secondaryLink:
  React.CSSProperties =
{
  ...secondaryButton,

  textDecoration:
    "none",

  display:
    "inline-block",
};

const detailLabel:
  React.CSSProperties =
{
  color:
    "#77736D",

  fontSize:
    11,

  fontWeight:
    800,

  textTransform:
    "uppercase",

  letterSpacing:
    ".04em",
};

const emptyState:
  React.CSSProperties =
{
  border:
    "1px dashed #D8D6D2",

  borderRadius:
    8,

  padding:
    18,

  color:
    "#6B6862",

  background:
    "#FCFCFB",

  fontSize:
    13,
};
