import React, { useState } from "react";
import Piano from "react-piano-component";
import "./InteractivePiano.css";
import SheetMusic from "react-sheet-music";

const keyBindings = {
  Q: "C4",
  2: "C#4",
  W: "D4",
  3: "D#4",
  E: "E4",
  R: "F4",
  5: "F#4",
  T: "G4",
  6: "G#4",
  Y: "A4",
  7: "A#4",
  U: "B4",
  V: "C5",
  G: "C#5",
  B: "D5",
  H: "D#5",
  N: "E5",
  M: "F5",
  K: "F#5",
  ",": "G5",
  L: "G#5",
  ".": "A5",
  ";": "A#5",
  "/": "B5"
};

const keyTranslate = {
  C: "DO",
  D: "RE",
  E: "MI",
  F: "FA",
  G: "SOL",
  A: "LA",
  B: "SI"
};

var lastNote = "";
var sheetMusic = "| ";
function PianoContainer({ children }) {
  return (
    <div
      className={"interactive-piano__piano-container"}
      onMouseDown={(event) => event.preventDefault()}
    >
      {children}
    </div>
  );
}

function AccidentalKey({ isPlaying, text, eventHandlers }) {
  return (
    <div className={"interactive-piano__accidental-key__wrapper"}>
      <button
        onClick={() => (lastNote = translateAccidentalNote(text))}
        className={`interactive-piano__accidental-key ${
          isPlaying ? "interactive-piano__accidental-key--playing" : ""
        }`}
        {...eventHandlers}
      >
        <div className={"interactive-piano__text"}>{text}</div>
      </button>
    </div>
  );
}

function translateAccidentalNote(text) {
  const english = keyBindings[text];
  console.log(english);
  let name = english.slice(0, 1);
  let number = english.slice(2, 3);
  sheetMusic += "^" + name;
  console.log(sheetMusic);
  return keyTranslate[name] + english[1] + number;
}

function translateNaturalNote(text) {
  const english = keyBindings[text];
  console.log(english);
  let name = english.slice(0, 1);
  let number = english.slice(1, 2);
  sheetMusic += name;
  return keyTranslate[name] + number;
}

function NaturalKey({ isPlaying, text, eventHandlers }) {
  return (
    <button
      onClick={() => {
        lastNote = translateNaturalNote(text);
      }}
      className={`interactive-piano__natural-key ${
        isPlaying ? "interactive-piano__natural-key--playing" : ""
      }`}
      {...eventHandlers}
    >
      <div className={"interactive-piano__text"}>{text}</div>
    </button>
  );
}

function PianoKey({
  isNoteAccidental,
  isNotePlaying,
  startPlayingNote,
  stopPlayingNote,
  keyboardShortcuts
}) {
  function handleMouseEnter(event) {
    if (event.buttons) {
      startPlayingNote();
    }
  }

  const KeyComponent = isNoteAccidental ? AccidentalKey : NaturalKey;
  const eventHandlers = {
    onMouseDown: startPlayingNote,
    onMouseEnter: handleMouseEnter,
    onTouchStart: startPlayingNote,
    onMouseUp: stopPlayingNote,
    onMouseOut: stopPlayingNote,
    onTouchEnd: stopPlayingNote
  };
  return (
    <KeyComponent
      isPlaying={isNotePlaying}
      text={keyboardShortcuts.join(" / ")}
      eventHandlers={eventHandlers}
    />
  );
}

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  console.log("RERENDER");
  return () => setValue((value) => value + 1); // update the state to force render
}

export default function InteractivePiano() {
  const forceReRender = useForceUpdate();
  return (
    <div onClick={forceReRender}>
      <PianoContainer>
        <Piano
          startNote={"F3"}
          endNote={"B5"}
          renderPianoKey={PianoKey}
          keyboardMap={keyBindings}
        />
      </PianoContainer>
      <p>{sheetMusic}</p>
      <SheetMusic
        // Textual representation of music in ABC notation
        // The string below will show four crotchets in one bar
        notation={sheetMusic}
      />
      <button onClick={() => (sheetMusic = "| ")}>clear</button>
    </div>
  );
}
