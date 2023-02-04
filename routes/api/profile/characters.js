const express = require("express");
const { Prisma } = require("../../../js/PrismaConnection");
const CharStateUtils = require("../../../js/CharStateUtils");

const router = express.Router();

const authCheck = (req, res, next) => {
  let rSheetPageMatch = req.originalUrl.match(/\/profile\/characters\/\d+$/);
  if (!req.user && rSheetPageMatch == null) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, async (req, res) => {
  const user = await Prisma.users.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      isPatreonMember: true,
      characters: {
        select: {
          id: true,
          name: true,
          level: true,
          ancestryID: true,
          backgroundID: true,
          classID: true,
          ancestries: { select: { name: true } },
          heritages: { select: { name: true } },
          backgrounds: { select: { name: true } },
          infoJSON: true,
          classes: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const result = {
    isPatreonMember: !!user?.isPatreonMember,
    characterLimit: user?.isPatreonMember ? 6 : null,
    characters:
      user?.characters?.map((char) => {
        const { imageURL } = JSON.parse(char.infoJSON ?? "{}");

        return {
          id: char.id,
          name: char.name,
          ancestry: char.ancestries?.name ?? null,
          heratige: char.heritages?.name ?? null,
          background: char.backgrounds?.name ?? null,
          level: char.level,
          className: char.classes?.name ?? null,
          imageUrl: imageURL,
          isPlayable: CharStateUtils.isPlayable(char),
        };
      }) ?? [],
  };
  res.json(result);
  return;
});

module.exports = router;
