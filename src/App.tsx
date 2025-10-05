import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import EnvelopeAnimation from "./EnvelopeAnimation";
import FadeSlide from "./FadeSlide";
// import Calendar from "./Calendar";
import Countdown from "./CountDown";

function App() {
  const [isOpenFirst, setIsOpenFirst] = useState(true);
  const [isOpenSecond, setIsOpenSecond] = useState(false);

  // Audio state
  const [audioStarted, setAudioStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
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
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <FadeSlide
        show={isOpenFirst}
        direction="center"
        distance={120}
        duration={1}>
        <div className="content-center wedding" style={{ marginTop: "50px" }}>
          <div>
            <div className="title">Մենք ամուսնանում ենք</div>
            <div className="content-between">
              <div>Հոկտեմբեր 12</div>
              <div>2025</div>
            </div>
          </div>
        </div>

        <div className="content-center" style={{ position: "relative" }}>
          <img src="8.jpeg" alt="" />
          {isOpenSecond && <div className="names">Զալիբեկ + Հասմիկ</div>}
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
              {/* <Calendar /> */}
              <img src="10.png" alt="" style={{ width: "100%" }} />
            </div>

            <div
              className="content-center"
              style={{ marginTop: "20px", marginBottom: "20px" }}>
              <img
                src="https://static.tildacdn.one/tild3930-6261-4661-b737-623665393866/Group_738002694.svg"
                alt=""
              />
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
                <strong>Սաղմոսավանք վանական համալիր</strong> գ. Սաղմոսավան
              </div>
              <div className="section-img content-center">
                <img src="7.PNG" alt="" />
              </div>
              <div className="content-center">
                <a
                  className="button"
                  href="https://www.google.com/maps/place/%D0%A1%D0%B0%D0%B3%D0%BC%D0%BE%D1%81%D0%B0%D0%B2%D0%B0%D0%BD%D0%BA/@40.378522,44.3770736,5505m/data=!3m1!1e3!4m6!3m5!1s0x406a83a65b5f5b23:0x2c15637a87b6ecee!8m2!3d40.3805351!4d44.3967175!16s%2Fm%2F027tzt8?entry=ttu&g_ep=EgoyMDI1MDgxOS4wIKXMDSoASAFQAw%3D%3D"
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
                <strong>Lianna garden Hall</strong>
                <br />
                Փարաքար, Երիտասարդության 34
              </div>
              <div className="section-img content-center">
                <img src="6.JPG" alt="" />
              </div>
              <div className="content-center">
                <a
                  className="button"
                  href="https://www.google.com/maps/place/%D4%BC%D5%AB%D5%A1%D5%B6%D5%B6%D5%A1+%D4%B3%D5%A1%D6%80%D5%A4%D5%A5%D5%B6+%D5%80%D5%B8%D5%AC/@40.1701043,44.3691315,7114m/data=!3m1!1e3!4m9!3m8!1s0x406abf20058b7395:0xc8881d319e6d89ca!5m2!4m1!1i2!8m2!3d40.1649513!4d44.3920288!16s%2Fg%2F11ktyzthbv?entry=ttu&g_ep=EgoyMDI1MDgxOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noreferrer">
                  Քարտեզ
                </a>
              </div>
            </section>

            <section>
              <div className="section-img content-center mt-20">
                <img
                  src="https://static.tildacdn.one/tild3766-6165-4739-a264-396434326330/Group_738002636.svg"
                  alt=""
                />
              </div>
              <div
                className="mt-20 content-center"
                style={{ width: "390px", height: "90px" }}>
                <div className="timing-special-item">
                  <div className="time">11:30</div>
                  <div className="line" />
                  <div className="desc">Հարսի տուն</div>
                </div>
              </div>
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
            <div style={{ position: "relative", top: "5px" }}>
              <img src="11.JPG" alt="" style={{ width: "100%" }} />
              <div className="item-position a">
                <div style={{ position: "relative" }}>
                  <img
                    src="https://optim.tildacdn.one/tild3462-3630-4137-a261-633237383336/-/resize/710x/-/format/webp/photo.png.webp"
                    alt=""
                  />
                  <div className="text-position">
                    Արդ ինչը Աստված միացրեց, մարդը թող չբաժանի
                  </div>
                </div>
              </div>
            </div>
            <section>
              <div className="details">
                <img
                  src="https://optim.tildacdn.one/tild3163-3334-4366-b838-303130333531/-/format/webp/photo.png.webp"
                  alt=""
                />
                <div className="details-content">
                  <h1>Details</h1>
                  <br />
                  <div>
                    Ձեզ հետ բերեք ՍԵՐ, ժպիտներ ու անսահման դրական էմոցիաներ,
                    ինչպես նաև հարմարավետ կոշիկներ՝ պարելու համար։
                  </div>
                </div>
                <div className="countdown-section">
                  <div className="countdown-text">
                    մեր հարսանիքին մնացել է․․․
                  </div>
                  <Countdown target={undefined} />
                </div>
              </div>
            </section>
            <footer>
              <img
                className="footer-image-top"
                src="https://static.tildacdn.one/tild3663-3630-4330-a265-353665386132/photo.svg"
                alt=""
              />
              <div className="footer-text">
                with love <br />
                Zalibek & Hasmik
              </div>
              <img
                className="footer-image"
                src="https://optim.tildacdn.one/tild3163-3334-4366-b838-303130333531/-/format/webp/photo.png.webp"
                alt=""
              />
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
