import { zettelMode } from "./zettelMode";

const allowedKeys = [
	"t",
	"s",
	"r",
	"Escape",
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
];

export function createKeyHandler(
	getZettelMode: () => zettelMode,
	setZettelMode: (mode: zettelMode) => void
): (event: KeyboardEvent) => void {
	return function (event: KeyboardEvent) {
		if (event.key === "Escape") {
			event.preventDefault();
			setZettelMode(zettelMode.NORMAL);
			return;
		}
		console.log(`Key pressed: ${event.key}`);
		const mode = getZettelMode();
		if (mode === zettelMode.NORMAL) {
			if (["t", "s", "r"].includes(event.key)) {
				setZettelMode(
					event.key === "t" ? zettelMode.TMP :
					event.key === "s" ? zettelMode.SRC :
					zettelMode.REF
				);
				return;
			}
			if (!allowedKeys.includes(event.key)) {
				event.preventDefault();
				event.stopPropagation();
			}
		}
	};
}
