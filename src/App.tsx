import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import EnvelopeAnimation from "./EnvelopeAnimation";
import FadeSlide from "./FadeSlide";
// import Calendar from "./Calendar";
import Countdown from "./CountDown";
import Calendar from "./Calendar";

function App() {
  const [isOpenFirst, setIsOpenFirst] = useState(true);
  const [isOpenSecond, setIsOpenSecond] = useState(true);

  // Audio state
  const [audioStarted, setAudioStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false); // prevent auto-start after a manual pause
  const audioRef = useRef(null);

  // One-time attempt to start audio on the first user gesture (tap, click, key)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const tryStart = async () => {
      if (audioStarted || userPaused) return; // don't auto-start again if the user paused
      try {
        await a.play();
        setAudioStarted(true);
      } catch {
        // Still blocked (e.g., iOS silent switch); ignore.
      } finally {
        removeListeners();
      }
    };

    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "touchstart",
    ];
    // IMPORTANT: use the exact same options for add/remove
    const opts: AddEventListenerOptions = { passive: true }; // capture=false

    const removeListeners = () => {
      events.forEach((e) =>
        window.removeEventListener(e, tryStart as EventListener, opts)
      );
    };

    events.forEach((e) =>
      window.addEventListener(e, tryStart as EventListener, opts)
    );
    return removeListeners;
  }, [audioStarted, userPaused]);

  // Keep isPlaying in sync with the actual audio element (covers OS/auto pauses)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, []);

  const startAudioNow = async () => {
    const a = audioRef.current;
    if (!a || userPaused) return;
    try {
      await a.play();
      setAudioStarted(true);
      setIsPlaying(true);
    } catch (err) {
      console.warn("Audio blocked:", err);
    }
  };

  const openEnvelope = async () => {
    // Start audio immediately on the user click/tap
    await startAudioNow();

    setTimeout(() => {
      setIsOpenFirst(false);
    }, 3000);

    setTimeout(() => {
      setIsOpenSecond(true);
      setIsOpenFirst(true);
    }, 4000);
  };

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;

    if (isPlaying) {
      a.pause();
      setUserPaused(true); // user explicitly paused; don't auto-start again
    } else {
      setUserPaused(false); // user explicitly wants music
      try {
        await a.play();
      } catch (err) {
        console.warn("Audio blocked:", err);
      }
    }
  };

  return (
    <div className="main" style={{ maxWidth: "400px", margin: "0 auto" }}>
      <div className="fixed-bg"></div>
      <FadeSlide
        show={isOpenFirst}
        direction="center"
        distance={120}
        duration={1}>
        <div className="content-center wedding" style={{ marginTop: "50px" }}>
          <div>
            <div className="title">
              Շտապում ենք տեղեկացնել մեր հարսանյաց արարողության մասին
            </div>
            <div className="content-center">
              <div className="text-2">V&M</div>
            </div>
          </div>
        </div>
        {!isOpenSecond && (
          <>
            <div className="content-center letter-position">
              <EnvelopeAnimation openEnvelope={openEnvelope} />
            </div>
            <div className="under-letter-text">Սեղմեք բացիկի վրա</div>
          </>
        )}

        {isOpenSecond && (
          <>
            <div className="subtitle">
              <div className="play-button" onClick={togglePlay}>
                {!isPlaying ? (
                  <img
                    src="https://static.tildacdn.one/tild3837-3532-4231-b936-613631626366/photo.png"
                    alt="play"
                  />
                ) : (
                  <img
                    src="https://static.tildacdn.one/tild6535-3930-4832-b862-393531303865/dsrk.png"
                    alt="pause"
                  />
                )}
              </div>
              Սիրով հրավիրում ենք Ձեզ ներկա գտնվելու մեր հարսանյաց
              արարողությանը։
            </div>

            <div>
              <Calendar />
            </div>

            <div
              className="content-center"
              style={{ marginTop: "20px", marginBottom: "20px" }}>
              <div className="location">Location for you…</div>
            </div>

            <div className="icon content-center">
              <img
                src="https://static.tildacdn.one/tild3063-3462-4135-b763-386566386162/Vector.svg"
                alt=""
              />
            </div>

            <section>
              <div className="description">
                Պսակադրությունը կանցկացվի{" "}
                <strong>Նորավանք վանական համալիր</strong>
              </div>
              <div className="section-img content-center">
                <img src="7.jpg" alt="" />
              </div>
              <div className="content-center">
                <a
                  className="button"
                  href="https://yandex.com/maps/org/noravank/189913332504/?ll=45.440434%2C39.751864&z=10.49"
                  target="_blank"
                  rel="noreferrer">
                  Քարտեզ
                </a>
              </div>
            </section>

            <section>
              <div className="icon content-center mt-20">
                <img
                  src="https://static.tildacdn.one/tild3533-6335-4934-b533-623065653239/Vector222.svg"
                  alt=""
                />
              </div>
              <div className="description">
                Տոնական խնջույքը կանցկացվի
                <br />
                <strong>Palermo Hall</strong>
                <br />
              </div>
              <div className="section-img content-center">
                <img src="6.JPG" alt="" />
              </div>
              <div className="content-center">
                <a
                  className="button"
                  href="https://yandex.com/maps/org/palermo_hall/47026041904/?ll=44.601545%2C40.186564&z=18.32"
                  target="_blank"
                  rel="noreferrer">
                  Քարտեզ
                </a>
              </div>
            </section>

            <section>
              <div className="section-img content-center mt-40">
                <div className="location">Timing Special</div>
              </div>
              {/* <div
                className="mt-20 content-center"
                style={{ width: "390px", height: "90px" }}>
                <div className="timing-special-item">
                  <div className="time">11:30</div>
                  <div className="line" />
                  <div className="desc">Հարսի տուն</div>
                </div>
              </div> */}
              <div
                className="mt-20 content-center"
                style={{ width: "390px", height: "90px" }}>
                <div className="timing-special-item">
                  <div className="time">13:30</div>
                  <div className="line" />
                  <div className="desc">Պսակադրության արարողություն</div>
                </div>
              </div>
              <div
                className="mt-20 content-center"
                style={{ width: "390px", height: "90px" }}>
                <div className="timing-special-item">
                  <div className="time">17:00</div>
                  <div className="line" />
                  <div className="desc">Հյուրերի դիմավորում</div>
                </div>
              </div>
            </section>
            <section className="content-center">
              <div className="wedding-description title">
                <p>
                  Սիրելի հարազատներ, սիրով հրավիրում ենք Ձեզ մեզ հետ կիսելու այս
                  կարևոր օրը։
                </p>
                <div>
                  Սիրելիներ, խնդրում ենք այսօր լինել առավելագույնս ակտիվ, ուրախ
                  և պատրաստ այն ամենին, ինչ պատրաստել ենք ձեզ համար։ Այսօր
                  թույլատրված է ամեն ինչ՝ բացի ձանձրանալուց 😄։ Պարել եք՝
                  հիանալի, երգել եք՝ վայելեք, բայց նստել լռությամբ՝ չի
                  ընդունվում
                </div>
              </div>
            </section>
            <footer>
              <div className="details content-center">
                <div className="countdown-section">
                  <div className="countdown-text">
                    մեր հարսանիքին մնացել է․․․
                  </div>
                  <Countdown target={undefined} />
                </div>
              </div>
            </footer>
          </>
        )}

        {/* No autoPlay; only start via a user gesture. Keep it hidden. */}
        <audio
          ref={audioRef}
          src="/music.mp3" // place music.mp3 in /public
          loop
          preload="auto"
          style={{ display: "none" }}
        />
      </FadeSlide>
    </div>
  );
}

export default App;
