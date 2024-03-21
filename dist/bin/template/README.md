# Templates

You will note there is a tsconfig.json file in this folder. This is to ensure TS
does NOT include this folder in it's checks. These are templates and may be
written nonsensically to the TS compiler in order to make sense in a different
context.

There is currently no vscode mechanism for properly disabling TS checks and
LEAVE the TS tokens and colorization of the file. It is easy to make the
templates register as plain text, but this loses ANY code color hinting which is
very hard to debug and work with.
