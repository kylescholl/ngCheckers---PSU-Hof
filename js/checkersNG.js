angular
	.module("checkersNG", [])
	.controller("checkersController", function ($scope, $timeout) {
		const C_P1 = "#D1603D",
			C_P2 = "#808080",
			C_BLACK = "#221D23",
			C_WHITE = "#EEEEEE";

		const P1 = "Orange",
			P2 = "Black";

		const BOARD_WIDTH = 8;
		let isMoving = false;
		let start = null;
		let gameover = false;
		let winner = "";

		function Piece(player, x, y, isKing) {
			this.player = player;
			this.x = x;
			this.y = y;
			this.isKing = isKing;
		}

		$scope.newGame = function () {
			$scope.playerTurn = P1;
			$scope.scoreP1 = 0;
			$scope.scoreP2 = 0;
			$scope.nameP1 = P1;
			$scope.nameP2 = P2;
			$scope.board = [];
			isMoving = false;

			for (let row = 0; row < BOARD_WIDTH; row++) {
				$scope.board[row] = [];
				for (let col = 0; col < BOARD_WIDTH; col++) {
					if (
						(row === BOARD_WIDTH - 2 && col % 2 === 0) ||
						(row === BOARD_WIDTH - 1 && col % 2 === 1)
					) {
						$scope.board[row][col] = new Piece(P1, col, row, false);
					} else if (
						(row === 0 && col % 2 === 0) ||
						(row === 1 && col % 2 === 1)
					) {
						console.log(col, row);
						$scope.board[row][col] = new Piece(P2, col, row, false);
					} else {
						$scope.board[row][col] = new Piece(
							null,
							col,
							row,
							false
						);
					}
				}
			}
		};

		// Manually call at game load / startup
		$scope.newGame();

		// Player Piece Coloring
		$scope.setStyling = function (tile) {
			if (tile.player === P1) {
				return { backgroundColor: C_P1 };
			} else if (tile.player === P2) {
				return { backgroundColor: C_P2 };
			} else {
				return { backgroundColor: "none" };
			}
		};

		// Board Tile Coloring
		$scope.setClass = function (tile) {
			if (tile.y % 2 === 0) {
				if (tile.x % 2 === 0) {
					return { backgroundColor: C_BLACK };
				} else {
					return { backgroundColor: C_WHITE };
				}
			} else {
				if (tile.x % 2 === 1) {
					return { backgroundColor: C_BLACK };
				} else {
					return { backgroundColor: C_WHITE };
				}
			}
		};

		// Player Square Selection
		$scope.select = function (tile) {
			console.log("");
			checkGameover();
			if (gameover === true) {
				// gameover code //
				showGameover();
			} else {
				if (!isMoving) {
					if (tile.player === $scope.playerTurn) {
						// New Turn
						console.log("\nNEW TURN");
						console.log(tile);
						// start = tile;
						start = $scope.board[tile.y][tile.x];
						// Get available moves
						// let moves = getMoves(square);
						// Highlight playable moves
						// showMoves(moves);
						// Reset variables
						isMoving = true;
					}
				} else {
					// Mid Turn
					console.log("\nMID TURN");
					console.log(getBoardPiece(tile));
					checkMove(tile);
				}
				try {
					$scope.selectedPiece = `{${start.player}, (${start.x}, ${start.y})}`;
				} catch (error) {
					// start.player always returns null on an empty tile
					// console.error(error);
				}
			}
		};

		// Check if selected move is legal
		function checkMove(tile) {
			const end = getBoardPiece(tile);

			console.log($scope.board[end.y][end.x]);

			let FL, JL, FR, JR;
			let FL_K, JL_K, FR_K, JR_K; // represent going backwards
			// dynamically set depending on $scope.playerTurn
			if ($scope.playerTurn == P1) {
				console.log(P1);
				FL = { x: start.x - 1, y: start.y - 1 };
				JL = { x: start.x - 2, y: start.y - 2 };
				FR = { x: start.x + 1, y: start.y - 1 };
				JR = { x: start.x + 2, y: start.y - 2 };
				if (start.isKing) {
					FL_K = { x: start.x - 1, y: start.y + 1 };
					JL_K = { x: start.x - 2, y: start.y + 2 };
					FR_K = { x: start.x + 1, y: start.y + 1 };
					JR_K = { x: start.x + 2, y: start.y + 2 };
				}
			} else {
				console.log(P2);
				FL = { x: start.x + 1, y: start.y + 1 };
				JL = { x: start.x + 2, y: start.y + 2 };
				FR = { x: start.x - 1, y: start.y + 1 };
				JR = { x: start.x - 2, y: start.y + 2 };
				if (start.isKing) {
					FL_K = { x: start.x + 1, y: start.y - 1 };
					JL_K = { x: start.x + 2, y: start.y - 2 };
					FR_K = { x: start.x - 1, y: start.y - 1 };
					JR_K = { x: start.x - 2, y: start.y - 2 };
				}
			}

			/**
			 * TODO: KINGING
			 * 1. Make Piece king when conditions are met -- DONE
			 * 2. Enable King movement
			 * 3. Configure king piece visual (use text with "K" in circle)
			 * 3a. Make sure piece stays as king (code) -- DONE
			 * 3b. Make sure piece stays as king (visual)
			 * 3c. Use CSS or AngularJS repeat to check for isKing?
			 */

			try {
				if (end.player == null) {
					// Check if king
					if (start.isKing) {
						// Backward Left
						console.error("A", `${end.x}, ${end.y}`);
						if (FL_K.x == end.x && FL_K.y == end.y) {
							console.log("FL_K");
							doMove(start, end, null);
							changeTurn();
						}
						// Backward Jump Left
						else if (JL_K.x == end.x && JL_K.y == end.y) {
							let checkSpace = $scope.board[FL_K.y][FL_K.x];
							console.log(checkSpace.player);
							if (
								checkSpace.player != $scope.playerTurn &&
								checkSpace.player != null
							) {
								console.log("JL_K");
								doMove(start, end, checkSpace);
								changeTurn();
							}
						} // Backward Right
						else if (FR_K.x == end.x && FR_K.y == end.y) {
							console.log("FR_K");
							doMove(start, end, null);
							changeTurn();
						}
						// Backward Jump Right
						else if (JR_K.x == end.x && JR_K.y == end.y) {
							let checkSpace = $scope.board[FR_K.y][FR_K.x];
							console.log(checkSpace.player);
							if (
								checkSpace.player != $scope.playerTurn &&
								checkSpace.player != null
							) {
								console.log("JR_K");
								doMove(start, end, checkSpace);
								changeTurn();
							}
						}
					}
					// Forward Left
					if (FL.x == end.x && FL.y == end.y) {
						console.log("FL");
						doMove(start, end, null);
						changeTurn();
					}
					// Forward Jump Left
					if (JL.x == end.x && JL.y == end.y) {
						let checkSpace = $scope.board[FL.y][FL.x];
						console.log(checkSpace.player);
						if (
							checkSpace.player != $scope.playerTurn &&
							checkSpace.player != null
						) {
							console.log("JL");
							doMove(start, end, checkSpace);
							changeTurn();
						}
					}
					// Forward Right
					if (FR.x == end.x && FR.y == end.y) {
						console.log("FR");
						doMove(start, end, null);
						changeTurn();
					}
					// Forward Jump Right
					if (JR.x == end.x && JR.y == end.y) {
						let checkSpace = $scope.board[FR.y][FR.x];
						console.log(checkSpace.player);
						if (
							checkSpace.player != $scope.playerTurn &&
							checkSpace.player != null
						) {
							console.log("JR");
							doMove(start, end, checkSpace);
							changeTurn();
						}
					}
				}
			} catch (error) {
				console.log("checkMove() error");
				console.error(error);
			}
		}

		// Execute the Player's Move
		function doMove(start_, end_, toDestroy_) {
			console.error("2", start_);
			console.error("3", start);
			const start_row = start_.y;
			const start_col = start_.x;
			const end_row = end_.y;
			const end_col = end_.x;

			let isKing = false;

			if (
				start_.isKing === true ||
				end_row === 0 ||
				end_row === BOARD_WIDTH - 1
			) {
				console.log("KING");
				console.log(
					`{ ${start_.isKing === true}, ${end_row === 0}, ${
						end_row === BOARD_WIDTH - 1
					} }`
				);
				isKing = true;
			}
			try {
				$scope.board[start_row][start_col] = new Piece(
					null,
					start_col,
					start_row,
					false
				);
				$scope.board[end_row][end_col] = new Piece(
					$scope.playerTurn,
					end_col,
					end_row,
					isKing
				);

				if (toDestroy_) {
					switch ($scope.playerTurn) {
						case P1:
							$scope.scoreP1 = parseInt($scope.scoreP1) + 1;
							break;
						case P2:
							$scope.scoreP2 = parseInt($scope.scoreP2) + 1;
							break;
						case null:
							break;
						default:
							break;
					}
					const destroy_row = toDestroy_.y;
					const destroy_col = toDestroy_.x;
					$scope.board[destroy_row][destroy_col] = new Piece(
						null,
						destroy_col,
						destroy_row,
						false
					);
				}
			} catch (error) {
				console.log(error);
			}
			console.log($scope.board);
		}

		function getBoardPiece(piece) {
			return $scope.board[piece.y][piece.x];
		}

		// Returns all playable moves
		function getMoves(square) {
			// FL
			// JL
			// FR
			// JR
		}

		// Shows All Playable Moves
		function showMoves(moves) {
			// code //
		}

		function changeTurn() {
			start = null;
			isMoving = false;
			switch ($scope.playerTurn) {
				case P1:
					$scope.playerTurn = P2;
					break;
				case P2:
					$scope.playerTurn = P1;
					break;
				default:
					break;
			}
		}

		function checkGameover() {
			if ($scope.scoreP1 > 8) {
				gameover == true;
				winner = P1;
			}
			if ($scope.scoreP2 > 8) {
				gameover == true;
				winner = P2;
			}
		}

		// Reset everything for new game
		function showGameover() {
			switch (winner) {
				case null:
					console.log("winner", "null");
					console.error("winner is null");
					$scope.newGame();
					break;
				case (P1, P2):
					console.error("case (P1, P2)");
					console.log("winner", winner);
					console.log(`Gameover: Congratulations ${winner}!`);
					$scope.newGame();
					break;
				case P2:
					console.log(`Gameover: Congratulations ${winner}!`);
					$scope.newGame();
					break;
				default:
					console.log("winner", "default");
					break;
			}

			if (winner === P1) {
				//code
			} else if (winner === P2) {
				console.log(`Gameover: Congratulations ${P1}!`);
			} else {
				console.error("Critical Bug: Game ");
			}
		}

		$scope.resetChoice = function () {
			start = null;
			isMoving = false;
			$scope.selectedPiece = " ";
		};
	});
