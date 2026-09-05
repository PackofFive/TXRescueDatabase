"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type FosterOption = { id: string; full_name: string };

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 9,
  border: "1px solid #E7E5E1",
  borderRadius: 6,
  fontSize: 13.5,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 5,
  color: "#3F3D39",
};

const secondaryButton: React.CSSProperties = {
  background: "#fff",
  color: "#17233C",
  border: "1px solid #D8D6D2",
  borderRadius: 7,
  padding: "8px 11px",
  fontWeight: 700,
  fontSize: 12.5,
  cursor: "pointer",
};

type ExistingAnimal = {
  id: string;
  name: string | null;
  temporary_name: string | null;
  species: string | null;
};

const GENERAL_NAMES = [
  "Mabel",
  "Poppy",
  "Juniper",
  "Tilly",
  "Waffles",
  "Maple",
  "Nellie",
  "Otis",
  "Winnie",
  "Piper",
  "Milo",
  "Louie",
  "Millie",
  "Hazel",
  "Archie",
  "Birdie",
  "Clover",
  "Scout",
  "Remy",
  "Frankie",
  "Dottie",
  "Theo",
  "Maisie",
  "Benny",
  "Olive",
  "Murphy",
  "Josie",
  "Finn",
  "Roscoe",
  "Pearl",
  "Mochi",
  "Sunny",
  "Beans",
  "Noodle",
  "Pickles",
  "Biscuit",
  "Pepper",
  "Honey",
  "Rory",
  "Juno",
  "Blue",
  "Cosmo",
  "Ziggy",
  "Freddie",
  "Lola",
  "Ruby",
  "Gus",
  "Ivy",
  "Cleo",
  "Tucker",
  "Minnie",
  "Harvey",
  "Sage",
  "Daisy",
  "Hugo",
  "Bonnie",
  "Marley",
  "Opal",
  "Rufus",
  "Georgia",
];

const DOG_NAMES = [
  "Banjo",
  "Ranger",
  "Maggie",
  "Hank",
  "Duke",
  "Sadie",
  "Cooper",
  "Beau",
  "Gertie",
  "Walter",
  "Teddy",
  "Millie",
  "Cash",
  "June",
  "Winston",
  "Dolly",
  "Bear",
  "Murray",
  "Penny",
  "Ollie",
  "Roo",
  "Baxter",
  "Lulu",
  "Moose",
  "Daphne",
  "Marty",
  "Fiona",
  "Howie",
  "Mavis",
  "Franklin",
];

const CAT_NAMES = [
  "Fig",
  "Miso",
  "Cleo",
  "Nori",
  "Minnie",
  "Felix",
  "Poe",
  "Luna",
  "Toast",
  "Salem",
  "Mochi",
  "Ivy",
  "Theo",
  "Olive",
  "Bean",
  "Pip",
  "Suki",
  "Basil",
  "Tuna",
  "Mabel",
  "Cosmo",
  "Poppy",
  "Sage",
  "Juno",
  "Winnie",
  "Marmalade",
];

const RABBIT_NAMES = [
  "Clover",
  "Thumper",
  "Bunty",
  "Pip",
  "Hazel",
  "Mochi",
  "Biscuit",
  "Maple",
  "Peaches",
  "Bean",
  "Dottie",
  "Poppy",
  "Fig",
  "Nibbles",
  "Juniper",
];

const BIRD_NAMES = [
  "Sunny",
  "Kiwi",
  "Pip",
  "Blue",
  "Peaches",
  "Mango",
  "Rio",
  "Skye",
  "Pepper",
  "Coco",
  "Birdie",
  "Fig",
  "Juno",
  "Basil",
  "Poppy",
];

const EQUINE_NAMES = [
  "Willow",
  "Scout",
  "Dakota",
  "Clover",
  "June",
  "Cash",
  "Blue",
  "Sage",
  "River",
  "Sunny",
  "Pearl",
  "Dolly",
  "Ranger",
  "Georgia",
  "Mabel",
];

const FARM_NAMES = [
  "Dottie",
  "Biscuit",
  "Maple",
  "Poppy",
  "Pickles",
  "Waffles",
  "Beans",
  "Dolly",
  "Mabel",
  "Pearl",
  "Peaches",
  "Clover",
  "Gertie",
  "Honey",
  "Mochi",
];

const WILDLIFE_NAMES = [
  "Fern",
  "River",
  "Sage",
  "Cedar",
  "Juniper",
  "Willow",
  "Ash",
  "Clover",
  "Sunny",
  "Maple",
  "Briar",
  "Meadow",
  "Sky",
  "Ember",
  "Pine",
];

const NAME_POOLS: Record<string, string[]> = {
  Dog: DOG_NAMES,
  Cat: CAT_NAMES,
  Rabbit: RABBIT_NAMES,
  Bird: BIRD_NAMES,
  Equine: EQUINE_NAMES,
  "Farm Animal": FARM_NAMES,
  Wildlife: WILDLIFE_NAMES,
  Other: GENERAL_NAMES,
};

const PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_PHOTO_SIZE =
  15 * 1024 * 1024;

export default function QuickIntakePage() {
  const [species, setSpecies] = useState("");
  const [name, setName] = useState("");
  const [temporaryName, setTemporaryName] = useState("");
  const [source, setSource] = useState("");

  const [custody, setCustody] =
    useState("rescue");

  const [placement, setPlacement] =
    useState("");

  const [approvedFosters, setApprovedFosters] = useState<FosterOption[]>([]);
  const [selectedFosterId, setSelectedFosterId] = useState("");

  const [urgency, setUrgency] =
    useState("normal");

  const [intakeDate, setIntakeDate] =
    useState(() =>
      new Date()
        .toISOString()
        .slice(0, 10)
    );

  const [photoFile, setPhotoFile] =
    useState<File | null>(null);

  const [photoPreviewUrl, setPhotoPreviewUrl] =
    useState<string | null>(null);

  const [notes, setNotes] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [savedId, setSavedId] =
    useState<string | null>(null);

  const [saveWarning, setSaveWarning] =
    useState<string | null>(null);

  const [
    existingAnimals,
    setExistingAnimals,
  ] =
    useState<ExistingAnimal[]>([]);

  const [
    loadingNames,
    setLoadingNames,
  ] =
    useState(true);

  const [
    nameSuggestions,
    setNameSuggestions,
  ] =
    useState<string[]>([]);

  const [
    nameMessage,
    setNameMessage,
  ] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadExistingNames() {
      setLoadingNames(true);

      try {
        const res =
          await fetch(
            "/api/animals?sort=name",
            {
              cache:
                "no-store",

              credentials:
                "same-origin",
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data.error ??
              "Couldn't load existing animal names."
          );
        }

        setExistingAnimals(
          Array.isArray(
            data.animals
          )
            ? data.animals
            : []
        );
      } catch (err) {
        console.error(
          "Quick Intake name exclusion load failed:",
          err
        );

        setNameMessage(
          "Name suggestions are available, but existing-name checking could not be loaded."
        );
      } finally {
        setLoadingNames(false);
      }
    }

    void loadExistingNames();
  }, []);

  useEffect(() => {
    fetch("/api/fosters/assignments", { cache: "no-store", credentials: "same-origin" })
      .then(async (response) => ({ ok: response.ok, data: await response.json() }))
      .then(({ ok, data }) => { if (ok) setApprovedFosters(data.fosters ?? []); })
      .catch(() => { /* Foster selection remains optional during intake. */ });
  }, []);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreviewUrl(
        null
      );

      return;
    }

    const url =
      URL.createObjectURL(
        photoFile
      );

    setPhotoPreviewUrl(
      url
    );

    return () => {
      URL.revokeObjectURL(
        url
      );
    };
  }, [photoFile]);

  const usedNames =
    useMemo(() => {
      const names =
        new Set<string>();

      for (
        const animal of
        existingAnimals
      ) {
        if (
          animal.name?.trim()
        ) {
          names.add(
            normalizeName(
              animal.name
            )
          );
        }

        if (
          animal.temporary_name?.trim()
        ) {
          names.add(
            normalizeName(
              animal.temporary_name
            )
          );
        }
      }

      return names;
    }, [
      existingAnimals,
    ]);

  const duplicateNameAnimal =
    useMemo(() => {
      const enteredName =
        normalizeName(name);

      if (!enteredName) {
        return null;
      }

      return (
        existingAnimals.find(
          (animal) =>
            normalizeName(
              animal.name ?? ""
            ) === enteredName ||
            normalizeName(
              animal.temporary_name ?? ""
            ) === enteredName
        ) ?? null
      );
    }, [
      name,
      existingAnimals,
    ]);

  function generateNames() {
    setNameMessage(null);

    const speciesPool =
      NAME_POOLS[
        species ||
          "Other"
      ] ??
      GENERAL_NAMES;

    const combined =
      [
        ...speciesPool,
        ...GENERAL_NAMES,
      ];

    const available =
      Array.from(
        new Set(
          combined
        )
      ).filter(
        (candidate) =>
          !usedNames.has(
            normalizeName(
              candidate
            )
          ) &&
          normalizeName(
            candidate
          ) !==
            normalizeName(
              name
            ) &&
          normalizeName(
            candidate
          ) !==
            normalizeName(
              temporaryName
            )
      );

    const shuffled =
      shuffle(
        available
      );

    const suggestions =
      shuffled.slice(
        0,
        5
      );

    setNameSuggestions(
      suggestions
    );

    if (
      suggestions.length ===
      0
    ) {
      setNameMessage(
        "No unused names were available in the current name library."
      );
    }
  }

  function chooseSuggestedName(
    suggestion: string
  ) {
    setName(
      suggestion
    );

    setNameMessage(
      `${suggestion} selected.`
    );
  }

  function handlePhotoSelection(
    file:
      | File
      | null
  ) {
    setError(null);

    if (!file) {
      setPhotoFile(
        null
      );

      return;
    }

    if (
      !PHOTO_TYPES.has(
        file.type
      )
    ) {
      setError(
        "Photo must be a JPG, PNG, or WebP image."
      );

      return;
    }

    if (
      file.size >
      MAX_PHOTO_SIZE
    ) {
      setError(
        "Photo must be 15 MB or smaller."
      );

      return;
    }

    setPhotoFile(
      file
    );
  }

  async function uploadIntakePhoto(
    animalId: string,
    file: File
  ) {
    const formData =
      new FormData();

    formData.set(
      "file",
      file
    );

    formData.set(
      "title",
      `${name.trim() ||
        temporaryName.trim() ||
        "Animal"} - Intake Photo`
    );

    formData.set(
      "category",
      "other"
    );

    formData.set(
      "documentDate",
      intakeDate
    );

    formData.set(
      "source",
      "Quick Intake"
    );

    formData.set(
      "notes",
      "Uploaded during Quick Animal Intake."
    );

    /*
      Keep intake photos private by default.
      Public use must be approved later.
    */
    formData.set(
      "visibility",
      "private"
    );

    const uploadRes =
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

    const uploadData =
      await uploadRes.json();

    if (!uploadRes.ok) {
      throw new Error(
        uploadData.error ??
          "The animal was created, but the photo could not be uploaded."
      );
    }

    const documentId =
      uploadData.document
        ?.id;

    if (!documentId) {
      throw new Error(
        "The animal was created and the photo uploaded, but the profile photo could not be set."
      );
    }

    const profileRes =
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
              documentId,
            }),
        }
      );

    const profileData =
      await profileRes.json();

    if (!profileRes.ok) {
      throw new Error(
        profileData.error ??
          "The photo uploaded, but it could not be set as the profile photo."
      );
    }
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError(null);
    setSaveWarning(null);
    setSaving(true);

    try {
      const res =
        await fetch(
          "/api/animals",
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
                species,
                name,
                temporaryName,
                source,
                custody,
                placement,
                urgency,
                intakeDate,

                /*
                  Photo URL is intentionally no longer used.
                  Intake photos now upload after the animal is
                  created so they can be stored securely in R2.
                */
                photoUrl:
                  "",

                notes,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Something went wrong recording intake."
        );
      }

      const animalId =
        String(
          data.animal.id
        );

      if (selectedFosterId) {
        try {
          const assignmentResponse = await fetch("/api/fosters/assignments", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ animalId, fosterId: selectedFosterId, notes: "Assigned during animal intake." }),
          });
          const assignmentData = await assignmentResponse.json();
          if (!assignmentResponse.ok) throw new Error(assignmentData.error ?? "The animal was created, but the foster could not be assigned.");
        } catch (assignmentError) {
          setSaveWarning(assignmentError instanceof Error ? assignmentError.message : "The animal was created, but the foster could not be assigned.");
        }
      }

      if (
        photoFile
      ) {
        try {
          await uploadIntakePhoto(
            animalId,
            photoFile
          );
        } catch (photoError) {
          setSaveWarning(
            photoError instanceof Error
              ? photoError.message
              : "The animal was created, but there was a problem adding the photo."
          );
        }
      }

      setSavedId(
        animalId
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong recording intake."
      );
    } finally {
      setSaving(false);
    }
  }

  if (savedId) {
    return (
      <section
        style={{
          maxWidth: 560,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing:
              ".08em",
            color: "#6B6862",
          }}
        >
          RESCUE MANAGER
        </p>

        <h1
          style={{
            fontSize: 25,
            color: "#17233C",
            margin:
              "6px 0 8px",
          }}
        >
          Intake recorded
        </h1>

        <p
          style={{
            fontSize: 13.5,
            color: "#2F6F4E",
            lineHeight: 1.6,
            marginBottom: 18,
          }}
        >
          The animal is now in
          your organization&apos;s
          records.
          {photoFile &&
          !saveWarning
            ? " The intake photo was uploaded and set as the profile photo."
            : ""}
        </p>

        {saveWarning && (
          <div
            style={{
              marginBottom:
                16,

              padding:
                11,

              borderRadius:
                8,

              background:
                "#FFF8F5",

              border:
                "1px solid #F0D3C9",

              color:
                "#85571F",

              fontSize:
                13,

              lineHeight:
                1.5,
            }}
          >
            <strong>
              Intake saved.
            </strong>{" "}
            {saveWarning}
            {" "}
            You can add or set the photo
            from Documents & Photos.
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <a
            href={`/animals/${encodeURIComponent(
              savedId
            )}`}
            style={{
              display:
                "inline-block",
              padding:
                "9px 14px",
              background:
                "#17233C",
              color: "#fff",
              textDecoration:
                "none",
              borderRadius: 7,
              fontSize: 13.5,
              fontWeight: 700,
            }}
          >
            Open Animal Record
          </a>

          <a
            href="/animals"
            style={{
              display:
                "inline-block",
              padding:
                "9px 14px",
              border:
                "1px solid #D8D6D2",
              color: "#17233C",
              textDecoration:
                "none",
              borderRadius: 7,
              fontSize: 13.5,
              fontWeight: 600,
            }}
          >
            Back to Animals
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        maxWidth: 560,
      }}
    >
      <a
        href="/animals"
        style={{
          fontSize: 12.5,
          color: "#C05621",
          textDecoration:
            "none",
        }}
      >
        ← Back to Animals
      </a>

      <p
        style={{
          margin:
            "18px 0 0",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing:
            ".08em",
          color: "#6B6862",
        }}
      >
        RESCUE MANAGER
      </p>

      <h1
        style={{
          fontSize: 26,
          color: "#17233C",
          margin:
            "5px 0 8px",
        }}
      >
        Quick Animal Intake
      </h1>

      <p
        style={{
          color: "#6B6862",
          fontSize: 13.5,
          lineHeight: 1.6,
          marginBottom: 18,
        }}
      >
        Record only what you know
        right now. The animal&apos;s
        full file can be completed
        later.
      </p>

      <div
        style={{
          background:
            "#F6F7F8",
          border:
            "1px solid #E7E5E1",
          borderRadius: 8,
          padding: 12,
          marginBottom: 22,
          color: "#4F4D49",
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        <strong>
          Use this when your
          organization is taking
          responsibility for or
          actively managing an
          animal.
        </strong>{" "}
        Shelter animals that are
        only being reviewed for
        possible rescue should
        remain under Urgent
        Shelter Animals until your
        organization formally
        commits.
      </div>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <div
          style={{
            marginBottom: 14,
          }}
        >
          <label
            style={
              labelStyle
            }
          >
            Species *
          </label>

          <select
            value={species}
            onChange={(e) => {
              setSpecies(
                e.target.value
              );

              setNameSuggestions(
                []
              );

              setNameMessage(
                null
              );
            }}
            required
            style={
              inputStyle
            }
          >
            <option value="">
              Select…
            </option>
            <option value="Dog">
              Dog
            </option>
            <option value="Cat">
              Cat
            </option>
            <option value="Rabbit">
              Rabbit
            </option>
            <option value="Bird">
              Bird
            </option>
            <option value="Equine">
              Equine
            </option>
            <option value="Farm Animal">
              Farm Animal
            </option>
            <option value="Wildlife">
              Wildlife
            </option>
            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                gap: 8,
                alignItems:
                  "center",
                marginBottom: 5,
              }}
            >
              <label
                style={{
                  ...labelStyle,
                  marginBottom: 0,
                }}
              >
                Name
              </label>

              <button
                type="button"
                disabled={
                  loadingNames
                }
                onClick={
                  generateNames
                }
                style={{
                  ...secondaryButton,
                  opacity:
                    loadingNames
                      ? 0.6
                      : 1,
                  cursor:
                    loadingNames
                      ? "default"
                      : "pointer",
                }}
              >
                {loadingNames
                  ? "Loading names…"
                  : "Generate Names"}
              </button>
            </div>

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="If known"
              style={
                inputStyle
              }
            />

            {duplicateNameAnimal && (
              <div
                style={{
                  marginTop: 7,
                  padding: "8px 9px",
                  border: "1px solid #E7C8A3",
                  borderRadius: 7,
                  background: "#FFF8EF",
                  color: "#85571F",
                  fontSize: 11.5,
                  lineHeight: 1.45,
                }}
              >
                <strong>
                  Name already in use.
                </strong>{" "}
                {name.trim()} is already used by an animal
                in this organization. You can still use the
                name if it is intentional.
              </div>
            )}

            {nameSuggestions.length >
              0 && (
              <div
                style={{
                  marginTop: 8,
                  padding: 9,
                  border:
                    "1px solid #E7E5E1",
                  borderRadius: 7,
                  background:
                    "#FAFAF9",
                }}
              >
                <div
                  style={{
                    fontSize: 11.5,
                    color:
                      "#6B6862",
                    marginBottom: 7,
                  }}
                >
                  Suggestions not currently
                  used by this organization:
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    gap: 6,
                    flexWrap:
                      "wrap",
                  }}
                >
                  {nameSuggestions.map(
                    (suggestion) => (
                      <button
                        key={
                          suggestion
                        }
                        type="button"
                        onClick={() =>
                          chooseSuggestedName(
                            suggestion
                          )
                        }
                        style={{
                          border:
                            "1px solid #D8D6D2",
                          background:
                            name ===
                            suggestion
                              ? "#EEF1F5"
                              : "#fff",
                          color:
                            "#17233C",
                          borderRadius:
                            20,
                          padding:
                            "5px 9px",
                          fontSize:
                            12,
                          fontWeight:
                            name ===
                            suggestion
                              ? 700
                              : 600,
                          cursor:
                            "pointer",
                        }}
                      >
                        {suggestion}
                      </button>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={
                    generateNames
                  }
                  style={{
                    border:
                      "none",
                    background:
                      "transparent",
                    color:
                      "#C05621",
                    fontSize:
                      11.5,
                    fontWeight:
                      700,
                    padding:
                      "8px 0 0",
                    cursor:
                      "pointer",
                  }}
                >
                  Show different names
                </button>
              </div>
            )}

            {nameMessage && (
              <div
                style={{
                  marginTop: 6,
                  color:
                    nameMessage.endsWith(
                      "selected."
                    )
                      ? "#2F6F4E"
                      : "#85571F",
                  fontSize: 11.5,
                  lineHeight: 1.4,
                }}
              >
                {nameMessage}
              </div>
            )}
          </div>

          <div>
            <label
              style={
                labelStyle
              }
            >
              Temporary name
            </label>

            <input
              value={
                temporaryName
              }
              onChange={(e) =>
                setTemporaryName(
                  e.target.value
                )
              }
              placeholder="If no established name"
              style={
                inputStyle
              }
            />
          </div>
        </div>

        <div
          style={{
            marginBottom: 14,
          }}
        >
          <label
            style={
              labelStyle
            }
          >
            Photo
          </label>

          <div
            style={{
              border:
                "1px solid #E7E5E1",

              borderRadius:
                8,

              padding:
                11,

              background:
                "#FAFAF9",
            }}
          >
            <input
              type="file"

              accept="image/jpeg,image/png,image/webp"

              onChange={(e) =>
                handlePhotoSelection(
                  e.target
                    .files?.[0] ??
                    null
                )
              }

              style={{
                width:
                  "100%",

                fontSize:
                  12.5,

                fontFamily:
                  "inherit",
              }}
            />

            {photoFile &&
            photoPreviewUrl ? (
              <div
                style={{
                  display:
                    "flex",

                  gap:
                    12,

                  alignItems:
                    "center",

                  marginTop:
                    11,

                  flexWrap:
                    "wrap",
                }}
              >
                <img
                  src={
                    photoPreviewUrl
                  }

                  alt="Intake photo preview"

                  style={{
                    width:
                      110,

                    height:
                      90,

                    objectFit:
                      "cover",

                    borderRadius:
                      8,

                    border:
                      "1px solid #E7E5E1",

                    background:
                      "#F1F1EF",
                  }}
                />

                <div
                  style={{
                    flex:
                      1,

                    minWidth:
                      180,
                  }}
                >
                  <strong
                    style={{
                      display:
                        "block",

                      color:
                        "#17233C",

                      fontSize:
                        12.5,

                      overflowWrap:
                        "anywhere",
                    }}
                  >
                    {
                      photoFile.name
                    }
                  </strong>

                  <div
                    style={{
                      marginTop:
                        4,

                      color:
                        "#6B6862",

                      fontSize:
                        11.5,
                    }}
                  >
                    {formatFileSize(
                      photoFile.size
                    )}
                    {" · "}
                    This will become the
                    animal&apos;s profile
                    photo.
                  </div>

                  <button
                    type="button"

                    onClick={() =>
                      setPhotoFile(
                        null
                      )
                    }

                    style={{
                      border:
                        "none",

                      background:
                        "transparent",

                      color:
                        "#B23B2E",

                      padding:
                        "7px 0 0",

                      fontSize:
                        11.5,

                      fontWeight:
                        700,

                      cursor:
                        "pointer",
                    }}
                  >
                    Remove photo
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  marginTop:
                    7,

                  color:
                    "#6B6862",

                  fontSize:
                    11.5,

                  lineHeight:
                    1.4,
                }}
              >
                Optional. JPG, PNG, or WebP,
                up to 15 MB. The photo is
                stored privately and set as
                the profile photo after the
                intake is created.
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            marginBottom: 14,
          }}
        >
          <label
            style={
              labelStyle
            }
          >
            Source
          </label>

          <select
            value={source}
            onChange={(e) =>
              setSource(
                e.target.value
              )
            }
            style={
              inputStyle
            }
          >
            <option value="">
              Select if known…
            </option>

            <option value="Shelter Transfer">
              Shelter transfer
            </option>

            <option value="Owner Surrender">
              Owner surrender
            </option>

            <option value="Stray / Found">
              Stray / found
            </option>

            <option value="Rescue Transfer">
              Transfer from another rescue
            </option>

            <option value="Cruelty / Neglect">
              Cruelty / neglect
            </option>

            <option value="Emergency Medical">
              Emergency medical
            </option>

            <option value="Born in Care">
              Born in care
            </option>

            <option value="Public Assistance">
              Public assistance case
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div
          style={{
            marginBottom: 14,
          }}
        >
          <label
            style={
              labelStyle
            }
          >
            Current care /
            custody *
          </label>

          <select
            value={custody}
            onChange={(e) =>
              setCustody(
                e.target.value
              )
            }
            required
            style={
              inputStyle
            }
          >
            <option value="rescue">
              In organization care
            </option>

            <option value="owner">
              Still with owner —
              organization is actively
              assisting
            </option>

            <option value="other">
              Other active responsibility
            </option>
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <div>
            <label
              style={
                labelStyle
              }
            >
              Placement
            </label>

            <select
              value={
                placement
              }
              onChange={(e) =>
                setPlacement(
                  e.target.value
                )
              }
              style={
                inputStyle
              }
            >
              <option value="">
                Not recorded
              </option>

              <option value="in_foster">
                In Foster
              </option>

              <option value="in_facility">
                In Facility
              </option>

              <option value="medical_hold">
                Medical Hold
              </option>

              <option value="adoption_ready">
                Adoption Ready
              </option>

              <option value="adoption_pending">
                Adoption Pending
              </option>

              <option value="temporary_care">
                Temporary Care
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </div>

          {approvedFosters.length > 0 && (
            <div>
              <label style={labelStyle}>Assign approved foster (optional)</label>
              <select
                value={selectedFosterId}
                onChange={(event) => {
                  setSelectedFosterId(event.target.value);
                  if (event.target.value) setPlacement("in_foster");
                }}
                style={inputStyle}
              >
                <option value="">Assign later</option>
                {approvedFosters.map((foster) => <option key={foster.id} value={foster.id}>{foster.full_name}</option>)}
              </select>
            </div>
          )}

          <div>
            <label
              style={
                labelStyle
              }
            >
              Urgency
            </label>

            <select
              value={
                urgency
              }
              onChange={(e) =>
                setUrgency(
                  e.target.value
                )
              }
              style={
                inputStyle
              }
            >
              <option value="normal">
                Normal
              </option>

              <option value="monitor">
                Monitor
              </option>

              <option value="priority">
                Priority
              </option>

              <option value="urgent">
                Urgent
              </option>

              <option value="critical">
                Critical
              </option>
            </select>
          </div>
        </div>

        <div
          style={{
            marginBottom: 14,
          }}
        >
          <label
            style={
              labelStyle
            }
          >
            Intake / responsibility
            date *
          </label>

          <input
            type="date"
            value={
              intakeDate
            }
            onChange={(e) =>
              setIntakeDate(
                e.target.value
              )
            }
            required
            style={
              inputStyle
            }
          />
        </div>

        <div
          style={{
            marginBottom: 18,
          }}
        >
          <label
            style={
              labelStyle
            }
          >
            Quick notes
          </label>

          <textarea
            rows={4}
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }
            placeholder="Anything important that should follow this animal into the record."
            style={
              inputStyle
            }
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            padding:
              "9px 18px",
            background:
              "#17233C",
            color: "#fff",
            border: "none",
            borderRadius: 7,
            fontWeight: 700,
            cursor:
              saving
                ? "default"
                : "pointer",
            opacity:
              saving
                ? 0.6
                : 1,
          }}
        >
          {saving
            ? photoFile
              ? "Recording & Uploading…"
              : "Recording…"
            : "Record Intake"}
        </button>

        {error && (
          <p
            style={{
              color:
                "#B23B2E",
              fontSize: 13,
              marginTop: 10,
            }}
          >
            {error}
          </p>
        )}
      </form>
    </section>
  );
}

function normalizeName(
  value: string
) {
  return value
    .trim()
    .toLocaleLowerCase();
}

function shuffle<T>(
  items: T[]
) {
  const result = [
    ...items,
  ];

  for (
    let i =
      result.length -
      1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() *
          (i + 1)
      );

    [
      result[i],
      result[j],
    ] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

function formatFileSize(
  bytes: number
) {
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
