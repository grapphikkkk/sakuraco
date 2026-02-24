import { createBrowserRouter } from "react-router";
import { HomeBeforeLogin } from "./screens/00_01_HomeBeforeLogin";
import { EmailVerification } from "./screens/00_01_EmailVerification";
import { VerificationCode } from "./screens/00_01_VerificationCode";
import { AccountCreation } from "./screens/00_02_AccountCreation";
import { OAuthMock } from "./screens/00_02_OAuthMock";
import { ProfileSetup } from "./screens/00_03_ProfileSetup";
import { Onboarding } from "./screens/01_02_Onboarding";
import { PersonalityQuestions } from "./screens/PersonalityQuestions";
import { HomeAfterLogin } from "./screens/HomeAfterLogin";
import { EventDetail01 } from "./screens/01_04_Event_detail_01";
import { EventDetailDay } from "./screens/02_04_Event_detail_03";
import { FeedbackScreen } from "./screens/03_01_Feedback";
import { ConnectionResult } from "./screens/03_02_Connection_Result";
import { Payment } from "./screens/01_05_Payment";
import { Reservations } from "./screens/Reservations";
import { MyPage } from "./screens/MyPage";
import { SchoolSelection } from "./screens/SchoolSelection";
import { Topick } from "./screens/Topick";
import { TopickDetail } from "./screens/TopickDetail";
import { RootLayout } from "./components/RootLayout";
import React from "react";

const rootLayoutElement = React.createElement(RootLayout);
const homeBeforeLoginElement = React.createElement(HomeBeforeLogin);
const emailVerificationElement = React.createElement(EmailVerification);
const verificationCodeElement = React.createElement(VerificationCode);
const accountCreationElement = React.createElement(AccountCreation);
const oauthMockElement = React.createElement(OAuthMock);
const profileSetupElement = React.createElement(ProfileSetup);
const onboardingElement = React.createElement(Onboarding);
const personalityQuestionsElement = React.createElement(PersonalityQuestions);
const homeAfterLoginElement = React.createElement(HomeAfterLogin);
const eventDetail01Element = React.createElement(EventDetail01);
const eventDetailDayElement = React.createElement(EventDetailDay);
const feedbackElement = React.createElement(FeedbackScreen);
const connectionResultElement = React.createElement(ConnectionResult);
const paymentElement = React.createElement(Payment);
const reservationsElement = React.createElement(Reservations);
const myPageElement = React.createElement(MyPage);
const schoolSelectionElement = React.createElement(SchoolSelection);
const topickElement = React.createElement(Topick);
const topickDetailElement = React.createElement(TopickDetail);

export const router = createBrowserRouter([
  {
    path: "/",
    element: rootLayoutElement,
    children: [
      {
        index: true,
        element: homeBeforeLoginElement,
      },
      {
        path: "email-verification",
        element: emailVerificationElement,
      },
      {
        path: "email-verify-code",
        element: verificationCodeElement,
      },
      {
        path: "account-creation",
        element: accountCreationElement,
      },
      {
        path: "auth/mock",
        element: oauthMockElement,
      },
      {
        path: "profile-setup",
        element: profileSetupElement,
      },
      {
        path: "onboarding",
        element: onboardingElement,
      },
      {
        path: "personality-question",
        element: personalityQuestionsElement,
      },
      {
        path: "home",
        element: homeAfterLoginElement,
      },
      {
        path: "event/:eventId",
        element: eventDetail01Element,
      },
      {
        path: "event-day/:eventId",
        element: eventDetailDayElement,
      },
      {
        path: "topick",
        element: topickElement,
      },
      {
        path: "topick/:topicId",
        element: topickDetailElement,
      },
      {
        path: "feedback/:eventId",
        element: feedbackElement,
      },
      {
        path: "connection-result/:eventId",
        element: connectionResultElement,
      },
      {
        path: "payment",
        element: paymentElement,
      },
      {
        path: "reservations",
        element: reservationsElement,
      },
      {
        path: "mypage",
        element: myPageElement,
      },
      {
        path: "school-selection",
        element: schoolSelectionElement,
      },
    ],
  },
], {
  basename: "/sakuraco",
});