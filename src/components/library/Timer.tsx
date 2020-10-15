import React, {useEffect, useRef, useState} from "react";
import {ReactComponent} from "*.svg";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import {COUNT_DOWN_DATE} from "../../config/consts";
import {timer} from "rxjs";

const useStyles = makeStyles((theme) => ({
    text:{
        "text-align": "center",
        color: "red",
        "font-size": "3em",
        "max-width": "100%",
        "margin-left": "auto"
    },
    div: {
        align: "center"
    }

}));

export default function Timer() {
    const classes = useStyles();
    const [timerDays, setTimerDays] = useState("00");
    const [timerHours, setTimerHours] = useState("00");
    const [timerMinutes, setTimerMinutes] = useState("00");
    const [timerSeconds, setTimerSeconds] = useState("00");

    let interval = useRef();

    const startTimer= () => {
        const countDownDate = new Date(COUNT_DOWN_DATE).getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countDownDate - now;

            const days = Math.floor(distance / (1000*60*60*24)).toString();
            const hours = Math.floor((distance % (1000*60*60*24))/ (1000*60*60)).toString();
            const minutes = Math.floor((distance % (1000*60*60)) / (1000*60)).toString();
            const seconds = Math.floor((distance % (1000*60)) / 1000 ).toString();

            if (distance < 0 ) {
                clearInterval(interval)
            } else {
                setTimerDays(days);
                setTimerHours(hours);
                setTimerMinutes(minutes);
                setTimerSeconds(seconds);
            }

        }, 1000)
    }

    useEffect(()=> {
        startTimer();
        return () => {
            clearInterval(interval.current)
        }
    })

    return <React.Fragment>
        <div>
            <section className="timer-container">
                <section className="Timer">
                    <div className={classes.div}>
                        <text className={classes.text}>Action is over after:</text>

                    </div>
                    <CssBaseline/>
                    <Grid container spacing={10}>
                        <Grid item xs={3}>
                            <h2>{timerDays}</h2>
                        <h2>Days</h2>
                        </Grid>
                        <Grid item xs={3}>
                            <h2>{timerHours}</h2>
                            <h2>Hours</h2>
                        </Grid>
                        <Grid item xs={3}>
                            <h2>{timerMinutes}</h2>
                            <h2>Minutes</h2>
                        </Grid>
                        <Grid item xs={3}>
                            <h2>{timerSeconds}</h2>
                            <h2>Seconds</h2>
                        </Grid>
                    </Grid>
                </section>
            </section>

        </div>
    </React.Fragment>
}