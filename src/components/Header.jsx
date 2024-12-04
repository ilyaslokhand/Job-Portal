import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { Button } from "./ui/button";
import { SignedOut, SignIn, useUser } from "@clerk/clerk-react";
import { SignedIn } from "@clerk/clerk-react";
import { SignInButton } from "@clerk/clerk-react";
import { UserButton } from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";

const Header = () => {
  const [showSignin, setshowSignin] = useState(false);
  const [search, setsearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get("sign-in")) {
      setshowSignin(true);
    }
  }, [search]);

  const handlesideinclick = (e) => {
    if (e.target == e.currentTarget) {
      setshowSignin(false);
      setsearch({});
    }
  };

  return (
    <div>
      <nav className="flex justify-between items-center py-4">
        <Link>
          <img src={logo} className="h-20" />
        </Link>
        <div className="flex" style={{ gap: "12px" }}>
          <SignedOut>
            <Button variant="outline" onClick={() => setshowSignin(true)}>
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role == "Recruiter" && (
              <Link to="/Post-job">
                <Button className="rounded-full" variant="destructive">
                  <PenBox size={20} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            )}

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/My-jobs"
                ></UserButton.Link>
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/Saved-job"
                ></UserButton.Link>
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>
      {showSignin && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handlesideinclick}
        >
          <SignIn
            signUpForceRedirectUrl="/Onboarding"
            fallbackRedirectUrl="Onboarding"
          />
        </div>
      )}
    </div>
  );
};

export default Header;
