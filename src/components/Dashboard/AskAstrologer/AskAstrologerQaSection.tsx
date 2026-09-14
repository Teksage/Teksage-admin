import { Avatar, Box, Typography } from "@mui/material";
import { DashboardSectionPaper } from "../../Elements/DashboardSectionPaper";
import { ASK_DETAIL_PAGE } from "./askAstrologerUi";
import { initialsFromName } from "../Partners/partnerUsageUi";
import type { AskAstrologerItem } from "../../../api/askAstrologerAdmin";

function BotLogoIcon() {
  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        flexShrink: 0,
        mt: 0.25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="36" height="36" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.59375" width="32" height="32" rx="16" fill="white" />
        <rect
          x="1.89615"
          y="1.3024"
          width="29.3952"
          height="29.3952"
          rx="14.6976"
          stroke="#10B100"
          strokeOpacity="0.35"
          strokeWidth="2.6"
        />
        <path
          d="M25.8622 23.0335C25.362 22.7702 24.8623 22.5068 24.3631 22.243C23.3598 21.7121 22.3558 21.1827 21.3562 20.6452C21.2545 20.5898 21.1693 20.5086 21.109 20.4098C20.2486 18.9282 19.3918 17.4443 18.5386 15.9579C17.9268 14.8956 17.3174 13.8326 16.7105 12.7689C16.6794 12.7287 16.6438 12.6921 16.6045 12.6599C16.5674 12.6945 16.5338 12.7328 16.5043 12.774C15.1724 15.0833 13.8408 17.3933 12.5094 19.7041C12.3632 19.9637 12.2118 20.224 12.0575 20.4807C12.0257 20.5358 11.9797 20.5815 11.9244 20.613C10.4132 21.416 8.9019 22.2169 7.39064 23.0159C7.36791 23.0227 7.34468 23.0276 7.32117 23.0306L16.6045 6.98828L25.8819 23.0064L25.8622 23.0335Z"
          fill="#10B100"
        />
        <path
          d="M16.6032 17.3675C16.6163 17.3092 16.6993 17.3092 16.7124 17.3675L16.9729 18.5237C17.1413 19.2712 17.7252 19.855 18.4728 20.0234L19.6291 20.2838C19.6873 20.2969 19.6873 20.3799 19.6291 20.393L18.4728 20.6535C17.7252 20.8219 17.1413 21.4057 16.9729 22.1532L16.7124 23.3094C16.6993 23.3676 16.6163 23.3676 16.6032 23.3094L16.3427 22.1532C16.1743 21.4057 15.5905 20.8219 14.8429 20.6535L13.6866 20.393C13.6283 20.3799 13.6283 20.2969 13.6866 20.2838L14.8429 20.0234C15.5905 19.855 16.1743 19.2712 16.3427 18.5237L16.6032 17.3675Z"
          fill="#10B100"
        />
      </svg>
    </Box>
  );
}

export function AskAstrologerQaSection({ data }: { data: AskAstrologerItem }) {
  const userInitials = initialsFromName(data.customer_name);

  return (
    <DashboardSectionPaper title={ASK_DETAIL_PAGE.sectionQa}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          border: "1px solid rgba(0, 0, 0, 0.08)",
          bgcolor: "#ffffff",
          backgroundImage:
            "radial-gradient(ellipse 90% 70% at 32% 25%, rgba(198, 231, 185, 0.55) 0%, rgba(227, 248, 225, 0.28) 45%, #ffffff 82%)",
          p: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        {/* Customer Question Bubble (Right aligned) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            gap: 1.5,
            width: "100%",
          }}
        >
          <Box
            sx={{
              maxWidth: { xs: "85%", sm: "75%", md: "68%" },
              bgcolor: "#10B100",
              color: "#ffffff",
              borderRadius: "18px",
              px: 2.25,
              py: 1.5,
              boxShadow: "0 2px 10px rgba(16, 177, 0, 0.16)",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Urbanist",
                fontWeight: 700,
                fontSize: "0.9375rem",
                lineHeight: 1.6,
                color: "#ffffff",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {data.user_question}
            </Typography>
          </Box>

          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#ececec",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              color: "#4a4a4a",
              fontFamily: "Urbanist",
              fontWeight: 700,
              fontSize: "0.8rem",
              flexShrink: 0,
              mt: 0.25,
            }}
            aria-hidden
          >
            {userInitials}
          </Avatar>
        </Box>

        {/* AI Answer Bubble (Left aligned) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: 1.5,
            width: "100%",
          }}
        >
          <BotLogoIcon />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.25,
              maxWidth: { xs: "90%", sm: "80%", md: "72%" },
            }}
          >
            <Box
              sx={{
                bgcolor: "#ffffff",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                borderRadius: "18px",
                px: 2.25,
                py: 1.75,
                boxShadow: "0 1px 6px rgba(0, 0, 0, 0.06)",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Urbanist",
                  fontWeight: 500,
                  fontSize: "0.9375rem",
                  lineHeight: 1.65,
                  color: "#1a1a1a",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {data.ai_response}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </DashboardSectionPaper>
  );
}
